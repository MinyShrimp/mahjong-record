
export const ErrorCode: { [key: number]: string } = {
    0: "전송이 완료되었습니다.",           // "SUCCESS"
    1: "이름 입력란이 비어있습니다.",      // "EMPTY_NAME"
    2: "점수 입력란이 비어있습니다.",      // "EMPTY_SCORE"
    3: "별 입력란에 문자가 있습니다.",     // "ERROR_STAR"
    4: "역만을 확인해주세요.",             // "ERROR_PERPECT"
    5: "역만의 범위가 이상합니다.",        // "PERPECT_OUT_OF_RANGE"
    6: "점수의 합계가 0이 아닙니다.",      // "SCORE_NOT_ZERO"
    7: "공탁금 입력란을 확인해주세요.",    // "ERROR_DEPOSIT"
    8: "공탁금이 음수로 되어있습니다.",    // "MINUS_DEPOSIT"
    9: "별 입력란이 음수로 되어있습니다.", // "MINUS_STAR"
    10: "이름이 중복되었습니다.",          // "DUPLICATE_NAME"
    99: "알 수 없는 이유로 등록을 실패했습니다."
};