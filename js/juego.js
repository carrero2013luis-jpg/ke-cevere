/* =========================================================
   Kè Cévere Arcade
   juego.js — Antes estaba inline dentro de <script> en gioco.html
   ========================================================= */


        /* =====================================================
           VARIABLES
        ===================================================== */

        let level = 1;

        let consecutiveWins = 0;

        let discount =
            parseFloat(
                localStorage.getItem(
                    'kecevere_discount'
                )
            ) || 0.00;

        let gameActive = false;

        let spawnInterval = null;

        let spawnedCount = 0;

        const totalPieces = 50;


        /* =====================================================
           SISTEMA DE PARTIDAS DIARIAS
        ===================================================== */

        const todayKey =
            new Date()
                .toISOString()
                .slice(0, 10);

        let gameData =
            JSON.parse(
                localStorage.getItem(
                    'kecevere_arcade'
                )
            ) || {
                date: todayKey,
                plays: 0
            };


        if (gameData.date !== todayKey) {

            gameData = {
                date: todayKey,
                plays: 0
            };

            localStorage.setItem(
                'kecevere_arcade',
                JSON.stringify(gameData)
            );

        }


        /* =====================================================
           ELEMENTOS HTML
        ===================================================== */

        const playArea =
            document.getElementById(
                'play-area'
            );

        const startScreen =
            document.getElementById(
                'start-screen'
            );

        const endScreen =
            document.getElementById(
                'end-screen'
            );

        const startBtn =
            document.getElementById(
                'start-btn'
            );

        const levelDisplay =
            document.getElementById(
                'level-display'
            );

        const discountDisplay =
            document.getElementById(
                'discount-display'
            );

        const gamesLeftDisplay =
            document.getElementById(
                'games-left'
            );

        const endTitle =
            document.getElementById(
                'end-title'
            );

        const endMessage =
            document.getElementById(
                'end-message'
            );

        const endActionBtn =
            document.getElementById(
                'end-action-btn'
            );


        /* =====================================================
           CATÁLOGO DE OBJETOS
        ===================================================== */

        const catalog = [

            {
                icon: '🍬',
                type: 'point'
            },

            {
                icon: '🍭',
                type: 'point'
            },

            {
                icon: '🍩',
                type: 'point'
            },

            {
                icon: '🎂',
                type: 'point'
            },

            {
                icon: '🍫',
                type: 'point'
            },

            {
                icon: '💣',
                type: 'bomb'
            }

        ];


        /* =====================================================
           INICIALIZAR INTERFAZ
        ===================================================== */

        updateMenuUI();


        /* =====================================================
           ACTUALIZAR INTERFAZ
        ===================================================== */

        function updateMenuUI() {

            const remaining =
                Math.max(
                    0,
                    5 - gameData.plays
                );


            gamesLeftDisplay.innerText =
                `${remaining}/5`;


            levelDisplay.innerText =
                `${level} / 10`;


            discountDisplay.innerText =
                `€${discount.toFixed(2)}`;


            const globalBadge =
                document.getElementById(
                    'global-discount-counter'
                );


            if (globalBadge) {

                globalBadge.innerText =
                    `€${discount.toFixed(2)}`;

            }


            if (remaining <= 0) {

                startBtn.innerText =
                    'Limite giornaliero esaurito';

                startBtn.disabled = true;

            } else {

                startBtn.innerText =
                    'INIZIA PARTITA';

                startBtn.disabled = false;

            }

        }


        /* =====================================================
           GUARDAR DESCUENTO
        ===================================================== */

        function saveDiscount() {

            localStorage.setItem(
                'kecevere_discount',
                discount.toFixed(2)
            );

            updateMenuUI();

        }


        /* =====================================================
           INICIAR PARTIDA
        ===================================================== */

        function startGame() {

            if (gameData.plays >= 5) {
                return;
            }


            gameData.plays++;


            localStorage.setItem(
                'kecevere_arcade',
                JSON.stringify(gameData)
            );


            startScreen.style.display =
                'none';

            endScreen.style.display =
                'none';


            // Limpiar completamente el área
            playArea
                .querySelectorAll(
                    '.falling-item, .popup-msg, .victory-confetti'
                )
                .forEach(
                    element => element.remove()
                );


            gameActive = true;

            spawnedCount = 0;


            /* =============================================
               CREAR OBJETOS
            ============================================= */

            spawnInterval =
                setInterval(() => {

                    if (!gameActive) {
                        return;
                    }


                    if (
                        spawnedCount <
                        totalPieces
                    ) {

                        createFallingItem();

                        spawnedCount++;

                    }

                    else if (
                        playArea.querySelectorAll(
                            '.falling-item'
                        ).length === 0
                    ) {

                        endGame('win');

                    }

                }, 350);


            updateMenuUI();

        }


        /* =====================================================
           CREAR ELEMENTO QUE CAE
        ===================================================== */

        function createFallingItem() {

            const randIndex =
                Math.random() < 0.2
                    ? 5
                    : Math.floor(
                        Math.random() * 5
                    );


            const itemData =
                catalog[randIndex];


            const el =
                document.createElement('div');


            el.className =
                'falling-item';


            el.innerText =
                itemData.icon;


            const maxX =
                Math.max(
                    10,
                    playArea.clientWidth - 50
                );


            el.style.left =
                `${Math.random() * maxX}px`;


            el.style.top =
                '-60px';


            const duration =
                Math.random() * 2 + 3;


            el.style.animationDuration =
                `${duration}s`;


            /* =============================================
               CONTROLAR SI LLEGA AL FONDO
            ============================================= */

            const checkBottom =
                setTimeout(() => {

                    if (
                        gameActive &&
                        el.parentElement
                    ) {

                        el.remove();


                        if (
                            itemData.type ===
                            'point'
                        ) {

                            triggerGameOver(
                                'Un dolce è caduto a terra!'
                            );

                        }

                    }

                }, duration * 1000);


            /* =============================================
               CLICK / TOQUE
            ============================================= */

            el.addEventListener(
                'click',
                (e) => {

                    e.stopPropagation();


                    if (!gameActive) {
                        return;
                    }


                    clearTimeout(
                        checkBottom
                    );


                    el.remove();


                    /* BOMBA */

                    if (
                        itemData.type ===
                        'bomb'
                    ) {

                        triggerGameOver(
                            'Hai colpito una bomba! 💣'
                        );

                        return;

                    }


                    /* DULCE */

                    discount += 0.02;

                    saveDiscount();


                    showPopup(
                        '+0.02€',
                        e.clientX - 30,
                        e.clientY,
                        '#d97706'
                    );


                    if (
                        spawnedCount >=
                            totalPieces &&
                        playArea.querySelectorAll(
                            '.falling-item'
                        ).length === 0
                    ) {

                        endGame('win');

                    }

                }
            );


            playArea.appendChild(el);

        }


        /* =====================================================
           GAME OVER
        ===================================================== */

        function triggerGameOver(reason) {

            if (!gameActive) {
                return;
            }


            gameActive = false;


            clearInterval(
                spawnInterval
            );


            /* Limpiar objetos */

            playArea
                .querySelectorAll(
                    '.falling-item, .popup-msg, .victory-confetti'
                )
                .forEach(
                    element => element.remove()
                );


            /* El descuento se pierde */

            discount = 0.00;

            saveDiscount();


            /* Reiniciar victorias */

            consecutiveWins = 0;


            /* Mostrar pantalla */

            endScreen.style.display =
                'flex';


            endTitle.innerText =
                '💥 GAME OVER';


            endTitle.classList.remove(
                'victory'
            );


            endTitle.classList.add(
                'game-over'
            );


            endMessage.innerHTML = `

                ${reason}

                <br><br>

                <span
                    style="
                        font-size:0.9rem;
                        color:#78716c;
                    "
                >
                    Hai perso lo sconto
                    accumulato.
                </span>

            `;


            /* Botón TRY AGAIN */

            endActionBtn.innerText =
                'TRY AGAIN';


            endActionBtn.onclick =
                resetToMenu;

        }


        /* =====================================================
           POPUP +0.02€
        ===================================================== */

        function showPopup(
            text,
            x,
            y,
            color
        ) {

            const popup =
                document.createElement(
                    'div'
                );


            popup.className =
                'popup-msg';


            popup.innerText =
                text;


            const rect =
                playArea.getBoundingClientRect();


            popup.style.left =
                `${x - rect.left}px`;


            popup.style.top =
                `${y - rect.top}px`;


            popup.style.color =
                color;


            playArea.appendChild(
                popup
            );


            setTimeout(() => {

                popup.remove();

            }, 500);

        }


        /* =====================================================
           FINAL DE PARTIDA - VICTORIA
        ===================================================== */

        function endGame(result) {

            if (!gameActive) {
                return;
            }


            gameActive = false;


            clearInterval(
                spawnInterval
            );


            playArea
                .querySelectorAll(
                    '.falling-item, .popup-msg'
                )
                .forEach(
                    element => element.remove()
                );


            endScreen.style.display =
                'flex';


            endActionBtn.innerText =
                'CONTINUA';


            endActionBtn.onclick =
                resetToMenu;


            if (result === 'win') {

                consecutiveWins++;


                endTitle.innerText =
                    '🎉 COMPLIMENTI! 🎉';


                endTitle.classList.remove(
                    'game-over'
                );


                endTitle.classList.add(
                    'victory'
                );


                /* =========================================
                   CONFETI
                ========================================= */

                for (
                    let i = 0;
                    i < 6;
                    i++
                ) {

                    const confetti =
                        document.createElement(
                            'div'
                        );


                    confetti.className =
                        'victory-confetti';


                    confetti.innerText =
                        [
                            '🍬',
                            '🎂',
                            '⭐',
                            '🎈',
                            '🍩'
                        ][
                            Math.floor(
                                Math.random() * 5
                            )
                        ];


                    confetti.style.left =
                        `${Math.random() * 80 + 10}%`;


                    confetti.style.top =
                        `${Math.random() * 50 + 20}%`;


                    confetti.style.animationDelay =
                        `${Math.random() * 0.5}s`;


                    endScreen.appendChild(
                        confetti
                    );

                }


                /* =========================================
                   SUBIR NIVEL
                ========================================= */

                if (
                    consecutiveWins >= 3
                ) {

                    if (level < 10) {
                        level++;
                    }


                    consecutiveWins = 0;


                    endMessage.innerHTML = `

                        Vittoria magistrale
                        senza errori!

                        <br><br>

                        🚀

                        <b>
                            Sei promosso al
                            Livello ${level}!
                        </b>

                        <br><br>

                        Sconto attuale:

                        <b>
                            €${discount.toFixed(2)}
                        </b>

                    `;

                }

                else {

                    endMessage.innerHTML = `

                        Livello superato
                        brillantemente!

                        <br><br>

                        Vittorie perfette:

                        <b>
                            ${consecutiveWins}/3
                        </b>

                        per salire di livello.

                        <br><br>

                        Sconto attuale:

                        <b>
                            €${discount.toFixed(2)}
                        </b>

                    `;

                }

            }

        }


        /* =====================================================
           VOLVER AL MENÚ
        ===================================================== */

        function resetToMenu() {

            endScreen.style.display =
                'none';


            startScreen.style.display =
                'flex';


            /* Limpiar todo */

            playArea
                .querySelectorAll(
                    '.falling-item, .popup-msg, .victory-confetti'
                )
                .forEach(
                    element => element.remove()
                );


            /* Actualizar interfaz */

            updateMenuUI();

        }


        /* =====================================================
           SINCRONIZACIÓN ENTRE PESTAÑAS
        ===================================================== */

        window.addEventListener(
            'storage',
            (e) => {

                if (
                    e.key ===
                    'kecevere_discount'
                ) {

                    discount =
                        parseFloat(
                            e.newValue
                        ) || 0.00;


                    updateMenuUI();

                }


                if (
                    e.key ===
                    'kecevere_arcade'
                ) {

                    try {

                        const newData =
                            JSON.parse(
                                e.newValue
                            );


                        if (
                            newData &&
                            newData.date ===
                            todayKey
                        ) {

                            gameData =
                                newData;


                            updateMenuUI();

                        }

                    }

                    catch (error) {

                        console.error(
                            'Errore sincronizzazione:',
                            error
                        );

                    }

                }

            }
        );

