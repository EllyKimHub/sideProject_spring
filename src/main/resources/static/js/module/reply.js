// reply.js는 모듈을 만들어 두는 파일이다.
// 자바스크립트의 함수, 클래스를 모듈화시켜 저장할 수 있다.
//우리는 함수를 부품으로 만들어두고 다른 파일에서 사용할 것이다.
//이 모듈을 밖에서 사용할 수 있도록 내보내는 키워드가 export이다.

// 함수를 매개변수로 넘겨줌(콜백함수)
// callback : boardView.js에서 넘겨받은 콜백함수 (showReply, showError를 포함한 함수)
export function add(reply, callback, error){
    $.ajax({
        url : '/replies/reply',
        type : 'post',
        data : JSON.stringify(reply), // 우리가 보낼 데이터를 JSON형태로 보내준다.
        contentType : 'application/json; charset=utf-8', // 보낼 데이터의 형식을 알려준다.
        // success랑 error랑 사용법 동일함
        success : function (){
        if (callback){
            callback();
            }
        },
        error : error
    });
}

// 콜백 함수는 넘겨받는 함수 (boardView.js에서 넘겨받음)
export function getList(boardNumber, callback, error){
    $.ajax({
        url : `/replies/list/${boardNumber}`,
        type : 'get',
        dataType : 'json',
        success : function (result){
            if (callback){
                callback(result);
            }
        },
        error : error
    });
}
export function getView(replyNumber, callback, error){
    $.ajax({
        url : `/replies/${replyNumber}`,
        type : 'get',
        dataType : 'json',
        success : function (result){
            if (callback){
                callback(result);
            }
        },
        error : error
    });
}
export function modify(reply,callback, error){
    $.ajax({
       url : `/replies/${reply.replyNumber}`,   // reply안에 있는 replyNumber받기
       type : 'patch',                          // 컨트롤러에서 매핑 이름 확인하기
       data : JSON.stringify(reply),
       contentType : 'application/json; charset=utf-8',
        success : function (){
            if (callback){
                callback();
            }
        },
        error : error
    });
}
export function remove(replyNumber, callback, error){
    $.ajax({
        url : `/replies/${replyNumber}`,     // replyNumber만 필요하므로 이것만 받음
        type : 'delete',
        success : function (){
            if (callback){
                callback();
            }
        },
        error : error
    });
}

export function getListPage(pageInfo, callback, error){
    $.ajax({
        url : `/replies/list/${pageInfo.boardNumber}/${pageInfo.page}`, // BoardController의 showBoardList의 pageInfo
        type : 'get',
        dataType : 'json',
        success : function (result){
            if(callback){
                callback(result);
            }
        },
        error : error
    });
}


// 댓글에 n 시간 전 띄우기
export function timeForToday(value){
    // new Date() 현재 날짜와 시간
    const today = new Date();
    const timeValue = new Date(value);

    // console.log(today);
    // console.log(timeValue);

    // Math.floor()는 소수점을 내림 처리 해준다.
    // getTime()은 1970년 01/01 을 기준으로 지금까지 몇 ms가 지났는지 알려준다.
    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);

    // console.log(betweenTime);

    if(betweenTime < 1) { return "방금 전"; }
    if(betweenTime < 60) {
        return `${betweenTime}분 전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if(betweenTimeHour < 24){
        return `${betweenTimeHour}시간 전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if(betweenTimeDay < 365){
        return `${betweenTimeDay}일 전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년 전`;
}






