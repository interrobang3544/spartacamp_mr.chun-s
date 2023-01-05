if (localStorage.getItem('token')) {
  getSelf(function (response) {
    if (response.userType !== 0) {
      window.location.replace('/');
    }
    document.getElementById('inputNickname').value = response.nickname;
    document.getElementById('inputPhoneNumber').value = response.phoneNumber;
    document.getElementById('inputAddress').value = response.address;
  });
} else {
  window.location.replace('/');
}

if (localStorage.getItem('token')) {
  document.getElementsByClassName('login-btn')[0].style.display = 'none';
} else {
  document.getElementsByClassName('logout-btn')[0].style.display = 'none';
  document.getElementsByClassName('logout-btn')[1].style.display = 'none';
}

// 로그아웃
function logout() {
  localStorage.clear();
  window.location.href = '/';
}

// 모달창
const myModal = new bootstrap.Modal('#alertModal');
function customAlert(text, confirmCallback) {
  document.getElementById('modal-text').innerHTML = text;
  myModal.show();
  if (confirmCallback) {
    $('#alertModal .btn-confirm').click(confirmCallback);
  }
}

// 모달창2 - 확인 버튼만 있는 것.
const myModal2 = new bootstrap.Modal('#alertModal2');
function customAlert2(text) {
  document.getElementById('modal-text2').innerHTML = text;
  myModal2.show();
}

// 사용자 정보 조회
function getSelf(callback) {
  axios
    .get('api/users/me', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      callback(response.data.user);
    })
    .catch((error) => {
      if (status == 401) {
        customAlert2('로그인이 필요합니다.');
      } else {
        // localStorage.clear();
        customAlert2('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
      }
      window.location.href = '/';
    });
}

// 회원 정보 수정 - 인풋값 받아오기 진행중
function modifyUser(phoneNumber, address) {
  // const phoneNumber = $('#service-id').attr('data-service-id');
  $.ajax({
    type: 'PUT',
    url: `/api/users`,
    data: JSON.stringify({
      phoneNumber: phoneNumber,
      address: address,
      // password: password,
      // confirm: confirm
    }),
    contentType: 'application/json; charset=UTF-8',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      console.log('modify response: ', response)
      customAlert2(response.message);
    },
    error: function (xhr) {
      console.log('modify failuser meessage: ', xhr.responseJSON.errorMessage);
      customAlert2(xhr.responseJSON.errorMessage);
    },
  });
}

// 서비스 신청
function applyService() {
  const phoneNumber = document.getElementById('inputPhoneNumber').value;
  const address = document.getElementById('inputAddress').value;
  const imageSrc = document.getElementById('image').src;
  const image = imageSrc || ' ';
  const customerRequest = document.getElementById('inputCustomerRequest').value;

  getSelf(function (response) {
    if (phoneNumber !== response.phoneNumber || address !== response.address) {
      // 유저 정보 수정
      // alert('회원 정보를 업데이트 하여야 합니다.');
      modifyUser(phoneNumber, address)
      customAlert2(
          '입력하신 정보로 회원 정보가 업데이트 되었습니다.'
        // '입력하신 정보로 회원 정보를 업데이트한 후 계속 진행하실 수 있습니다. 해당 주소와 전화 번호로 회원 정보를 업데이트 하시겠습니까?'
      );
      // return;
    }
  });

  axios
    .post(
      'api/services',
      {
        image: image,
        customerRequest: customerRequest,
      },
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    .then((response) => {
      console.log(response);
      console.log(response.data.data);
      customAlert2(response.data.message);
    })
    .catch((error) => {
      console.log(error);
      customAlert2(error.response.data.errorMessage);
    });
}

let imageSrc = '';

function loadFile(input) {
  console.log('input:', input.files[0]);

  let file = input.files[0];

  let newImage = document.getElementById('image');
  newImage.src = URL.createObjectURL(file);

  newImage.style.width = '100%';
  newImage.style.height = '100%';
  newImage.style.objectFit = 'contain';
}
