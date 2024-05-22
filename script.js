(function() {
    document.addEventListener("DOMContentLoaded", function() {
        function fetchData(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);
                        callback(null, data);
                    } else {
                        callback("Error: " + xhr.status);
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        }

        function displayItems(category, data, searchTerm = "") {
            var lampList = document.getElementById("lamp-list");
            lampList.innerHTML = "";
            var itemsFound = false;
            var itemsContainer = document.createElement("div");
            itemsContainer.classList.add("row");
            Object.keys(data[0].categories).forEach(function(key) {
                if (category === "all" || key === category) {
                    data[0].categories[key].items.forEach(function(item) {
                        if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                            itemsFound = true;
                            var card = document.createElement("div");
                            card.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");

                            var innerHTML = '<div class="card">' +
                                '<img src="' + item.image + '" class="card-img-top" alt="' + item.name + '">' +
                                '<div class="card-body">' +
                                '<h5 class="card-title">' + item.name + '</h5>' +
                                '<p class="card-text">Ціна: ' + item.price + ' грн</p>' +
                                '<p class="card-text">Опис: ' + item.description + '</p>' +
                                '<button class="btn btn-primary">Додати у кошик</button>' +
                                '</div>' +
                                '</div>';

                            card.innerHTML = innerHTML;
                            itemsContainer.appendChild(card);
                        }
                    });
                }
            });

            if (!itemsFound) {
                var noItemsMessage = document.createElement("h3");
                noItemsMessage.textContent = "На жаль, такий товар не знайдено :(";
                noItemsMessage.classList.add("col-12", "text-center");
                itemsContainer.appendChild(noItemsMessage);
            }

            lampList.appendChild(itemsContainer);
        }

        window.filterLamps = function() {
            var selectedCategory = document.getElementById("categoryFilter").value;
            fetchData("lamps.json", function(error, data) {
                if (error) {
                    console.error("Error:", error);
                } else {
                    displayItems(selectedCategory, data);
                }
            });
        };

        window.searchLamps = function() {
            var searchInput = document.getElementById("searchInput").value;
            var selectedCategory = document.getElementById("categoryFilter").value;
            fetchData("lamps.json", function(error, data) {
                if (error) {
                    console.error("Error:", error);
                } else {
                    displayItems(selectedCategory, data, searchInput);
                }
            });
        };

        fetchData("lamps.json", function(error, data) {
            if (error) {
                console.error("Error:", error);
            } else {
                var categoryFilter = document.getElementById("categoryFilter");
                Object.keys(data[0].categories).forEach(function(key) {
                    var option = document.createElement("option");
                    option.value = key;
                    option.textContent = data[0].categories[key].category;
                    categoryFilter.appendChild(option);
                });
                displayItems("all", data);
            }

            var welcomeModal = document.getElementById("welcomeModal");
            welcomeModal.classList.add("show");
            welcomeModal.style.display = "block";

            var welcomeForm = document.getElementById("welcomeForm");
            welcomeForm.addEventListener("submit", function(event) {
                event.preventDefault();
                var userName = document.getElementById("userName").value;
                welcomeModal.classList.remove("show");
                setTimeout(function() {
                    welcomeModal.style.display = "none";
                }, 1000);
                var welcomeMessage = document.getElementById("welcomeMessage");
                welcomeMessage.textContent = "Вітаємо вас на сайті, " + userName + "!";
                welcomeMessage.style.display = "block";
                setTimeout(function() {
                    welcomeMessage.style.display = "none";
                }, 3000);
            });

            var closeWelcomeModalButton = document.getElementById("closeWelcomeModal");
            closeWelcomeModalButton.addEventListener("click", function() {
                welcomeModal.classList.remove("show");
                setTimeout(function() {
                    welcomeModal.style.display = "none";
                }, 1000);
            });

            var feedbackForm = document.getElementById("form");
            feedbackForm.addEventListener("submit", function(event) {
                event.preventDefault();
                var thankYouMessage = document.getElementById("thank-you-message");
                thankYouMessage.style.display = "block";
                setTimeout(function() {
                    thankYouMessage.style.display = "none";
                }, 3000);
                feedbackForm.reset();
            });

            var carousel = document.getElementById("carouselExampleIndicators");
            var carouselItems = carousel.querySelectorAll('.carousel-item');
            var indicators = carousel.querySelectorAll('.carousel-indicators li');

            var currentIndex = 0;

            function goToSlide(index) {
                carouselItems[currentIndex].classList.remove('active');
                indicators[currentIndex].classList.remove('active');
                currentIndex = index;
                carouselItems[currentIndex].classList.add('active');
                indicators[index].classList.add('active');
            }

            document.querySelector('.carousel-control-prev').addEventListener('click', function() {
                var newIndex = currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1;
                goToSlide(newIndex);
            });

            document.querySelector('.carousel-control-next').addEventListener('click', function() {
                var newIndex = currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1;
                goToSlide(newIndex);
            });

            indicators.forEach(function(indicator, index) {
                indicator.addEventListener('click', function() {
                    goToSlide(index);
                });
            });

            setInterval(function() {
                var newIndex = (currentIndex + 1) % carouselItems.length;
                goToSlide(newIndex);
            }, 2000);
        });

        
        var navbarToggler = document.querySelector('.navbar-toggler');
        var navbarCollapse = document.querySelector('.navbar-collapse');

        navbarToggler.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            } else {
                navbarCollapse.classList.add('show');
            }
        });

        
        const gridElement = document.getElementById('gameBoard');
        const scoreElement = document.getElementById('score');
        const messageElement = document.getElementById('message');
        const startButton = document.getElementById('startButton');
        const restartButton = document.getElementById('restartButton');
        let score = 0;
        let activeCell = null;
        let gameInterval;
        let cellTimeout;

        function createGrid() {
            gridElement.innerHTML = '';
            for (let i = 0; i < 36; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.addEventListener('click', () => handleCellClick(cell));
                gridElement.appendChild(cell);
            }
        }

        function handleCellClick(cell) {
            if (cell === activeCell) {
                score++;
                scoreElement.textContent = `Очки: ${score}`;
                cell.classList.remove('active');
                clearTimeout(cellTimeout);  // Зупинити таймер клітинки
                activeCell = null;
            }
        }

        function activateRandomCell() {
            const cells = document.querySelectorAll('.cell');
            if (activeCell) {
                endGame();
                return;
            }
            const randomIndex = Math.floor(Math.random() * cells.length);
            activeCell = cells[randomIndex];
            activeCell.classList.add('active');
            cellTimeout = setTimeout(() => {
                if (activeCell) {
                    activeCell.classList.remove('active');
                    activeCell = null;
                }
            }, 3000);
        }

        function startGame() {
            score = 0;
            scoreElement.textContent = `Очки: ${score}`;
            messageElement.textContent = '';
            startButton.style.display = 'none';
            restartButton.style.display = 'inline-block';
            createGrid();
            gameInterval = setInterval(activateRandomCell, 3000);
        }

        function endGame() {
            clearInterval(gameInterval);
            clearTimeout(cellTimeout);  // Очистити таймер клітинки
            messageElement.textContent = 'Гра закінчена!';
            activeCell = null;
        }

        startButton.addEventListener('click', startGame);
        restartButton.addEventListener('click', startGame);
    });
})();
