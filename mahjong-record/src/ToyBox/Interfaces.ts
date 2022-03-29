
export interface Info {
    seat:    number,
    name:    string,
    score:   string,
    star:    string,
    perpect: string
};

export interface RankingInfo {
    Name:     string,
    Uma:      number,
    Score:    number,
    MaxScore: number,
    Star:     number,
    Count:    number,
    Rank_1:   number,
    Rank_2:   number,
    Rank_3:   number,
    Rank_4:   number
};

export interface SupportInfo {
    id:      number,
    name:    string,
    content: string
};

export interface PerpectInfo {
    id:        number,
    name:      string,
    select_id: number
};

export interface RecentUserInfo {
    name:        string,
    perpect:     Array<number>,
    ranking:     number,
    score:       number,
    seat:        number,
    star:        number,
    uma:         number
};

export interface RecentInfo {
    index:       number,
    users:       Array<RecentUserInfo>,
    deposit:     number,
    update_time: Date
};