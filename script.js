document.addEventListener('DOMContentLoaded', function() {
    // XSS 방지를 위한 이스케이프 함수
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 메뉴 데이터를 업데이트하는 함수
    async function updateMenuData() {
        try {
            // API 엔드포인트 URL (실제 사용 시 변경 필요)
            const response = await fetch('https://your-api-endpoint.com/menu', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 필요한 경우 인증 헤더 추가
                    // 'Authorization': 'Bearer your-token'
                }
            });

            if (!response.ok) {
                throw new Error('메뉴 데이터를 가져오는데 실패했습니다.');
            }

            const menuData = await response.json();
            updateMenuUI(menuData);
        } catch (error) {
            console.error('Error:', error);
            // 에러 발생 시 기본 메뉴를 표시하거나 에러 메시지를 보여줄 수 있습니다.
        }
    }

    // UI를 업데이트하는 함수
    function updateMenuUI(menuData) {
        const menuContainer = document.querySelector('.menu-container');
        
        // 기존 메뉴 컨테이너 초기화
        menuContainer.innerHTML = '';

        // 각 요일별 메뉴 카드 생성
        menuData.forEach((dayMenu, index) => {
            const dayCard = document.createElement('div');
            dayCard.className = 'day-menu';
            
            const dayTitle = document.createElement('h2');
            dayTitle.textContent = dayMenu.day;
            dayCard.appendChild(dayTitle);

            const menuList = document.createElement('ul');
            dayMenu.items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = escapeHtml(item);
                menuList.appendChild(listItem);
            });
            dayCard.appendChild(menuList);

            menuContainer.appendChild(dayCard);
        });

        // 현재 요일 강조 표시
        highlightCurrentDay();
    }

    // 현재 요일 강조 표시 함수
    function highlightCurrentDay() {
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const today = new Date().getDay();
        
        if (today === 0 || today === 6) return;
        
        const dayMenus = document.querySelectorAll('.day-menu');
        const currentDayMenu = dayMenus[today - 1];
        
        if (currentDayMenu) {
            currentDayMenu.style.border = '2px solid #e74c3c';
            currentDayMenu.style.transform = 'scale(1.05)';
        }
    }

    // 페이지 로드 시 메뉴 데이터 업데이트
    updateMenuData();

    // 1시간마다 자동으로 메뉴 데이터 업데이트
    setInterval(updateMenuData, 3600000);
}); 