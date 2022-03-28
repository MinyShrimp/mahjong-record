
import { Info, Test, ErrorCode } from "./Interfaces";

export const isCleanData = (datas: Array<Info>, deposit: string) : Test => {
    
    let _tmp = deposit === '' ? 0 : parseInt(deposit);
    if( isNaN(_tmp) ) {
        return { result: false, contents: ErrorCode["ERROR_DEPOSIT"] };
    } else if( _tmp < 0 ) {
        return { result: false, contents: ErrorCode["MINUS_DEPOSIT"] };
    }

    let _sum_score: number = _tmp;

    let arr_names = datas.map((value) => value.name);
    let set_names = new Set(arr_names);
    if( arr_names.length != set_names.size ) {
        return { result: false, contents: ErrorCode["DUPLICATE_NAME"] };
    }

    for (var i = 0; i < 4; i++) {
        if( datas[i].name === '' ) { 
            return { result: false, contents: ErrorCode["EMPTY_NAME"] };
        }

        let score = parseInt( datas[i].score );
        if( isNaN(score) ) { 
            return { result: false, contents: ErrorCode["EMPTY_SCORE"] };
        } else { 
            _sum_score += score; 
        }

        let star = datas[i].star === '' ? 0 : parseInt( datas[i].star );
        if( isNaN(star) ) { 
            return { result: false, contents: ErrorCode["ERROR_STAR"] };
        } else if( star < 0 ) {
            return { result: false, contents: ErrorCode["MINUS_STAR"] };
        }

        let perpect = datas[i].perpect.split('|');
        perpect.pop();
        for( var j = 0; j < perpect.length; j++ ) {
            let _tmp = parseInt(perpect[j]);
            if( isNaN( _tmp ) ) {
                return { result: false, contents: ErrorCode["ERROR_PERPECT"] };
            }

            if( _tmp < 1 || _tmp > 17 ) {
                return { result: false, contents: ErrorCode["PERPECT_OUT_OF_RANGE"] };
            }
        }
    }

    if( _sum_score !== 0 ) {
        return { result: false, contents: ErrorCode["SCORE_NOT_ZERO"] };
    } else {
        return { result: true, contents: ErrorCode["SUCCESS"] };
    }
}