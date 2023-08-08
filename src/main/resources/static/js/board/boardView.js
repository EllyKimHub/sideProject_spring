import * as reply from '../module/reply.js';
//모듈 경로는 일반적으로 상대경로로 접근한다.
//boardView.html에 script로 type="module" 처리 해줘야 사용 가능
//reply.js에서 export한 함수를 import해서 사용
const boardNumber = $('.board-num').val();
let page = 1;

reply.getListPage({boardNumber : boardNumber, page : page}, showReply, showError);  // reply에 있는 getListPage 함수가 reply.js의 callback으로 연결됨
// 별칭인 reply에 .을 찍으면 사용가능한 함수 이름이 뜸
// showReply, showError함수를 콜백함수로 사용
function showReply(map){
    // console.log(map);

    let text = '';

    map.replyList.forEach(r => {
        text += `
        <div class="reply" data-num="${r.replyNumber}">
          <div class="reply-box">
            <div class="reply-box__writer">${r.userId}</div>
            <div class="reply-box__content">${r.replyContent}</div>
          </div>
          <div class="reply-time">
            ${reply.timeForToday(r.replyRegisterDate == r.replyUpdateDate ? r.replyRegisterDate : r.replyUpdateDate)}
          </div>  
          <div class="reply-btn-box">
            `;

        if(r.userNumber == loginNumber){
            text += `    
                <span class="reply-btns"></span>
                <div class="reply-btns__box none">
                  <div class="reply-remove-btn">삭제</div>
                  <div class="reply-modify-btn">수정</div>
                </div>`;
        }

        text += `
            </div>
        </div>
        `;
    });

    $('.reply-list-wrap').html(text);
}

function appendText(map){
    let text = '';

    map.replyList.forEach(r => {
        text += `
        <div class="reply" data-num="${r.replyNumber}">
          <div class="reply-box">
            <div class="reply-box__writer">${r.userId}</div>
            <div class="reply-box__content">${r.replyContent}</div>
          </div>
          <div class="reply-time">
            ${reply.timeForToday(r.replyRegisterDate == r.replyUpdateDate ? r.replyRegisterDate : r.replyUpdateDate)}
          </div>  
          <div class="reply-btn-box">
            `;

        if(r.userNumber == loginNumber){
            text += `    
                <span class="reply-btns"></span>
                <div class="reply-btns__box none">
                  <div class="reply-remove-btn">삭제</div>
                  <div class="reply-modify-btn">수정</div>
                </div>`;
        }

        text += `
            </div>
        </div>
        `;

    });

    $('.reply-list-wrap').append(text);
}

//무한 스크롤 페이징
$(window).on('scroll', function(){
    console.log($(window).scrollTop());
//  $(window).scrollTop() : 현재 브라우저의 스크롤 위치를 의미한다.
    console.log(`document : ${$(document).height()}`)
//    $(document).height() : 문서 전체의 높이를 의미한다.
    console.log(`window : ${$(window).height()}`)
//    $(window).height() : 브라우저 화면의 높이를 의미한다.

    //현재 브라우저 스크롤의 위치 == 문서 높이 - 화면 높이      -> 문서 마지막에 스크롤이 도작했을 때
    if(Math.round($(window).scrollTop()) == $(document).height() - $(window).height()){
        console.log(++page);
        reply.getListPage({boardNumber : boardNumber, page : page}, appendText, showError);
    }
});


function showError(a, b, c){
    console.error(c);
}

//리플 작성 완료 처리
$('.btn-reply').on('click', function(){
    let content = $('#reply-content').val();

    let replyObj = {
        replyContent : content,
        boardNumber : boardNumber       // 전역변수로 만들어둔 const boardNumber = $('.board-num').val();
    }

    page = 1;

    reply.add(replyObj,
        function() {
            reply.getListPage({boardNumber : boardNumber, page : page}, showReply, showError);
        }
        ,showError);
    // 댓글 작성 후 빈문자로 보이도록
    $('#reply-content').val('');
});


//======================================================

$('.reply-list-wrap').on('click', '.reply-btns', function () {
    let $replyBtnBox = $(this).closest('.reply-btn-box').find('.reply-btns__box');

    $replyBtnBox.toggleClass('none');
});

$('body').click(function (e) {
    if ($(e.target).hasClass('reply-btns')) {
        // console.log('aa');
        return;
    }
    if (!$('.reply-btns__box').has(e.target).length) {
        $('.reply-btns__box').addClass('none');
    }
});

// 삭제 버튼
$('.btn-remove').on('click', function(){
    let boardNumber = $('.board-num').val();
    window.location.href = '/board/remove?boardNumber=' + boardNumber;

//    참고 : post로 요청보내기
//     let obj = document.createElement('input');
//     obj.setAttribute('type', 'hidden');
//     obj.setAttribute('name', 'boardNumber');
//     obj.setAttribute('value', boardNumber);
//
//     let f = document.createElement('form');
//     f.appendChild(obj);
//     f.setAttribute('method', 'post');
//     f.setAttribute('action', '/board/remove')
//     document.body.appendChild(f);
//     f.submit();
});

// 수정 버튼
$('.btn-modify').on('click', function(){
    let boardNumber = $('.board-num').val();
    window.location.href = '/board/modify?boardNumber=' + boardNumber;
});

//뒤로가기 버튼
$('.btn-back').on('click', function (){
    window.location.href = '/board/list';
})

//이미지 처리
displayAjax();

function displayAjax(){
    let boardNumber = $('.board-num').val();

    $.ajax({
        url : '/files/imgList',
        type : 'get',
        data : {boardNumber : boardNumber},
        success : function(files){
            let text = '';

            files.forEach(file => {
                let fileName = file.fileUploadPath + '/' + file.fileUuid + '_' + file.fileName;
                text += `
                    <a href="/files/download?fileName=${fileName}">
                      <img src="/files/display?fileName=${fileName}" data-number="${file.fileNumber}" data-name="${fileName}" />
                    </a>
`;
            });

            $('.post-images').html(text);
        }
    });
}



// 리플 삭제 버튼 처리
// 이벤트 위임처리 -> 이벤트 버블링(boardView.html의 .reply을 ajax로 동적처리함)
$('.reply-list-wrap').on('click', '.reply-remove-btn', function () {
    $('.reply-btns__box').addClass('none');

    let replyNumber = $(this).closest('.reply').data('num');

    page = 1;

    reply.remove(replyNumber, function(){
        reply.getListPage({boardNumber : boardNumber, page : page}, showReply, showError);
    }, showError);      // showError() 이건 바로 실행 시키는 것, showError은 함수 에러시 실행됨
});
// 이벤트 버블링 if문 사용해서 처리하기
// $('.reply-list-wrap').on('click', function (e){
//   if('.reply-remove-btn' == )
// });


// 리플 수정 버튼 처리
$('.reply-list-wrap').on('click', '.reply-modify-btn', function () {
    let $content = $(this).closest('.reply').find('.reply-box__content');
    $content.replaceWith(`
  <div class='modify-box'>
    <textarea class='modify-content'>${$content.text()}</textarea>
    <button type='button' class='modify-content-btn'>수정 완료</button>
  </div>
  `);
    $('.reply-btns__box').addClass('none');
});

// 리플 수정 완료 처리
$('.reply-list-wrap').on('click', '.modify-content-btn', function () {
    // console.log('modify!!!');
    let replyNumber = $(this).closest('.reply').data('num');
    let replyContent = $(this).closest('.modify-box').find('.modify-content').val();

    let replyObj = {
        replyNumber : replyNumber,
        replyContent : replyContent
    }

    page = 1;

    reply.modify(replyObj, function (){
        reply.getListPage({boardNumber : boardNumber, page : page}, showReply, showError);
    }, showError);
});

