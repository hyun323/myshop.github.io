document.addEventListener('DOMContentLoaded', function() {
    const menuForm = document.getElementById('menuForm');
    const daySections = document.querySelectorAll('.day-section');

    // 메뉴 항목 추가 버튼 이벤트
    document.querySelectorAll('.add-item-btn').forEach(button => {
        button.addEventListener('click', function() {
            const menuItems = this.closest('.menu-items');
            const newItem = createMenuItem();
            menuItems.appendChild(newItem);
        });
    });

    // 메뉴 항목 삭제 버튼 이벤트
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const menuItems = menuItem.closest('.menu-items');
            if (menuItems.children.length > 1) {
                menuItem.remove();
            }
        });
    });

    // 메뉴 항목 생성 함수
    function createMenuItem() {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <input type="text" placeholder="메뉴 항목 추가" required>
            <button type="button" class="add-item-btn">+</button>
            <button type="button" class="remove-item-btn">-</button>
        `;

        // 새로 생성된 버튼에 이벤트 리스너 추가
        menuItem.querySelector('.add-item-btn').addEventListener('click', function() {
            const menuItems = this.closest('.menu-items');
            const newItem = createMenuItem();
            menuItems.appendChild(newItem);
        });

        menuItem.querySelector('.remove-item-btn').addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const menuItems = menuItem.closest('.menu-items');
            if (menuItems.children.length > 1) {
                menuItem.remove();
            }
        });

        return menuItem;
    }

    // 폼 제출 이벤트
    menuForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const menuData = {};
        daySections.forEach(section => {
            const day = section.querySelector('h2').textContent;
            const items = Array.from(section.querySelectorAll('input')).map(input => input.value);
            menuData[day] = items;
        });

        // 메뉴 데이터를 텍스트 파일로 저장
        const menuText = JSON.stringify(menuData, null, 2);
        const blob = new Blob([menuText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'menu.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('메뉴가 저장되었습니다!');
        window.location.href = 'index.html';
    });

    // 저장된 메뉴 데이터 불러오기
    const savedMenuData = localStorage.getItem('menuData');
    if (savedMenuData) {
        const menuData = JSON.parse(savedMenuData);
        daySections.forEach(section => {
            const day = section.querySelector('h2').textContent;
            if (menuData[day]) {
                const menuItems = section.querySelector('.menu-items');
                menuItems.innerHTML = ''; // 기존 항목 제거
                
                menuData[day].forEach(item => {
                    const newItem = createMenuItem();
                    newItem.querySelector('input').value = item;
                    menuItems.appendChild(newItem);
                });
            }
        });
    }
}); 