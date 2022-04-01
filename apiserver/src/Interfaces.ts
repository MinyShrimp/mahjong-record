
export interface Info {
    name:    string,
    perpect: Array<number>
    ranking: number,
    score:   number,
    seat:    number,
    star:    number,
    uma:     number
};

export interface Test {
    result:   boolean,
    contents: number
};

export const ErrorCode = {
    "SUCCESS": 0,
    "EMPTY_NAME": 1,
    "EMPTY_SCORE": 2,
    "ERROR_STAR": 3,
    "ERROR_PERPECT": 4,
    "PERPECT_OUT_OF_RANGE": 5,
    "SCORE_NOT_ZERO": 6,
    "ERROR_DEPOSIT": 7,
    "MINUS_DEPOSIT": 8,
    "MINUS_STAR": 9,
    "DUPLICATE_NAME": 10,
    "LOGIN_FAILED_NOT_FOUND_ID": 11,
    "LOGIN_FAILED_NOT_MATCH_PWD": 12,
    "LOGIN_SUCCESS": 13,
    "DELETE_SUCCESS": 14,
    "UPDATE_SUCCESS": 15,
    "UNDEFIND_ERROR": 99
};