document.addEventListener('DOMContentLoaded', () => {
    fetch('/username')
        .then(response => response.json())
        .then(data => {
            document.getElementById('user-button').textContent = `Olá, ${data.username}`;
        })
        .catch(error => {
            console.error('Erro ao carregar o nome do usuário:', error);
            document.getElementById('user-button').textContent = 'Erro ao carregar nome';
        });

    document.getElementById('user-button').addEventListener('click', () => {
        const userMenu = document.getElementById('user-menu');
        userMenu.classList.toggle('show');
    });

    document.getElementById('logout-link').addEventListener('click', (event) => {
        event.preventDefault();
        fetch('/logout')
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(error => {
                console.error('Erro ao fazer logout:', error);
            });
    });

    window.addEventListener('click', (event) => {
        const userMenu = document.getElementById('user-menu');
        if (!userMenu.contains(event.target) && userMenu.classList.contains('show')) {
            userMenu.classList.remove('show');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    carregarLista();

    document.getElementById('listaForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const listaInput = document.getElementById('listaHabitInput').value;

        fetch('/api/lista', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lista: listaInput })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar o hábito');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('listaHabitInput').value = ''; // Limpa o input
            carregarLista(); // Atualiza a lista
        })
        .catch(error => console.error('Erro:', error));
    });

    document.getElementById('listaHabit').addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-habit')) {
            const listaId = event.target.getAttribute('data-id');

            fetch(`/api/lista/${listaId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir entrada do diário');
                }
                carregarLista();
            })
            .catch(error => console.error('Erro:', error));
        }
    });
});

function carregarLista() {
    fetch('/api/lista')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar entradas dos hábitos');
            }
            return response.json();
        })
        .then(lista => {
            mostrarLista(lista);
        })
        .catch(error => console.error('Erro:', error));
}

function mostrarLista(listas) {
    const listaHabito = document.getElementById('listaHabit');
    listaHabito.innerHTML = ''; // Limpa a lista existente

    listas.forEach(listah => {
        const habitLi = document.createElement('li');
        habitLi.classList.add('lista-item');
        habitLi.innerHTML = `
            ${listah.habit} - <span>${new Date(listah.created_at).toLocaleDateString()}</span>
            <button class="delete-habit" data-id="${listah.id}">✖</button>
        `;
        listaHabito.appendChild(habitLi);
    });
}
