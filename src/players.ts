// Список игроков, между которыми выбираем при входе на сайт.
// Чтобы добавить игрока — просто допишите строку сюда (имя + Dota/Steam account_id).
export type FavoritePlayer = {
  name: string;
  accountId: number;
};

export const FAVORITE_PLAYERS: FavoritePlayer[] = [
  { name: "Великий Артём", accountId: 1206334481 },
  { name: "Голубин", accountId: 1546378598 },
  { name: "Сунгуров", accountId: 864204078 },
  { name: "Icefrog", accountId: 1109303424 },
];

const STORAGE_KEY = "od_selected_player";

export const getSelectedPlayer = (): FavoritePlayer | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const id = Number(raw);
    return FAVORITE_PLAYERS.find((p) => p.accountId === id) || null;
  } catch (e) {
    return null;
  }
};

export const setSelectedPlayer = (accountId: number) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(accountId));
  } catch (e) {
    // localStorage может быть недоступен (приватный режим) — не критично
  }
};

export const RANK_NAMES = [
  "Без ранга",
  "Herald",
  "Guardian",
  "Crusader",
  "Archon",
  "Legend",
  "Ancient",
  "Divine",
  "Immortal",
];
