import querystring from "querystring";
import config from "../config";
import { fetchJson, HttpError } from "../apiCache";

export default function action(
  type: string,
  host: string,
  path: string,
  params = {},
  transform?: (value: any) => any,
) {
  return (dispatch: Function) => {
    const baseQuery =
      typeof params === "string"
        ? params.substring(1)
        : querystring.stringify(params);
    const keyQuery =
      config.VITE_API_KEY && host === config.VITE_API_HOST
        ? `${baseQuery ? "&" : ""}api_key=${config.VITE_API_KEY}`
        : "";
    const url = `${host}/${path}?${baseQuery}${keyQuery}`;
    const getDataStart = () => ({
      type: `REQUEST/${type}`,
    });
    const getDataOk = (payload: any) => ({
      type: `OK/${type}`,
      payload,
    });
    const getError = (error: string | number) => ({
      type: `ERROR/${type}`,
      error,
    });
    const fetchDataWithRetry = async (delay: number): Promise<any> => {
      try {
        let json: any;
        try {
          json = await fetchJson(
            url,
            // credentials нужны только для входа через Steam
            url.startsWith(config.VITE_API_HOST) && !config.VITE_API_KEY
              ? { credentials: "include" }
              : {},
          );
        } catch (e: any) {
          const err: any = new Error();
          err.fetchError = true;
          if (e instanceof HttpError) {
            dispatch(getError(e.status));
            // 429 (лимит запросов) — повторяем позже, остальные 4xx — окончательная ошибка
            if (e.status >= 400 && e.status < 500 && e.status !== 429) {
              err.clientError = true;
              err.message = "fetch failed - client error";
            } else {
              err.message = "fetch failed - retrying";
            }
          } else {
            // сетевая ошибка (нет связи, CORS и т.п.) — тоже пробуем ещё раз
            dispatch(getError("network"));
            err.message = "fetch failed - network, retrying";
          }
          throw err;
        }
        const transformedJson = transform ? await transform(json) : json;
        return dispatch(getDataOk(transformedJson));
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e, url);
        if (e.fetchError && !e.clientError) {
          setTimeout(() => fetchDataWithRetry(delay + 3000), delay);
        }
        if (!e.fetchError) {
          throw e;
        }
      }
    };
    dispatch(getDataStart());
    return fetchDataWithRetry(1000);
  };
}
