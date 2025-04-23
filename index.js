document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const fileButton = document.getElementById('fileButton');
    const textInput = document.getElementById('textInput');
    const addButton = document.getElementById('addButton');
    const outputContainer = document.getElementById('outputContainer');
    const editLink = document.getElementById('editLink');

    // 초기에 메뉴 작성하기 버튼 비활성화
    if (editLink) {
        editLink.classList.add('disabled');
    }

    // 저장된 메뉴 데이터 불러오기
    const savedMenuData = localStorage.getItem('menuData');
    
    if (savedMenuData) {
        try {
            const menuData = JSON.parse(savedMenuData);
            updateMenu(menuData);
            // 메뉴 데이터가 있으면 메뉴 작성하기 버튼 활성화
            if (editLink) {
                editLink.classList.remove('disabled');
            }
        } catch (error) {
            console.error('메뉴 데이터를 불러오는데 실패했습니다:', error);
        }
    }

    // 파일 선택 버튼과 입력 필드가 존재하는 경우에만 이벤트 리스너 추가
    if (fileButton && fileInput) {
        // 파일 선택 버튼 클릭 이벤트
        fileButton.addEventListener('click', function() {
            fileInput.click();
        });

        // 파일 선택 이벤트
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const menuData = JSON.parse(e.target.result);
                        // 로컬 스토리지에 저장
                        localStorage.setItem('menuData', JSON.stringify(menuData));
                        updateMenu(menuData);
                        // 메뉴 데이터가 있으면 메뉴 작성하기 버튼 활성화
                        if (editLink) {
                            editLink.classList.remove('disabled');
                        }
                    } catch (error) {
                        alert('메뉴 파일 형식이 올바르지 않습니다.');
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // 텍스트 입력 이벤트
    addButton.addEventListener('click', function() {
        const text = textInput.value.trim();
        if (text) {
            const p = document.createElement('p');
            p.textContent = text;
            outputContainer.appendChild(p);
            textInput.value = '';
        }
    });

    // Enter 키 입력 이벤트
    textInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });

    // 메뉴 업데이트 함수
    function updateMenu(menuData) {
        const days = ['월요일', '화요일', '수요일', '목요일'];
        
        days.forEach(day => {
            const menuList = document.querySelector(`.${day}-menu .menu-list`);
            if (menuList) {
                menuList.innerHTML = '';
                
                if (menuData[day]) {
                    menuData[day].forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        menuList.appendChild(li);
                    });
                }
            }
        });

        // 현재 요일 강조 표시
        highlightCurrentDay();
    }

    // 현재 요일 강조 표시 함수
    function highlightCurrentDay() {
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const today = new Date().getDay();
        
        if (today === 0 || today === 6) return; // 주말은 제외
        
        const dayMenus = document.querySelectorAll('.day-menu');
        const currentDayMenu = dayMenus[today - 1];
        
        if (currentDayMenu) {
            currentDayMenu.classList.add('highlight');
        }
    }

    // 페이지 로드 시 현재 요일 강조 표시
    highlightCurrentDay();
}); 