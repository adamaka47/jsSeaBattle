const record = document.getElementById('record')
const shot = document.getElementById('shot')
const hit = document.getElementById('hit')
const dead = document.getElementById('dead')
const enemy = document.getElementById('enemy')
const again = document.getElementById('again')
const header = document.querySelector('.header')

const stat = {
    record: localStorage.getItem('rec') || 0,
    shot: 0,
    hit: 0,
    dead: 0,
    set updateData(data) {
        this[data]++;
        this.render();
    },
    render() {
        record.textContent = this.record;
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
    }
}

const game = {
    ships: [],
    shipCount: 0,
    gameStarted: true,
    optionShip: {
        count: [1, 2, 3, 4],
        size: [4, 3, 2, 1]
    },
    cells: [],
    renderShips() {
        for (let i = 0; i < this.optionShip.count.length; i++) {
            for (let j = 0; j < this.optionShip.count[i]; j++) {
                const size = this.optionShip.size[i];
                const ship = this.generateOptionsShip(size);
                this.ships.push(ship);
                this.shipCount++;
            }
        }
    },
    generateOptionsShip(shipSize) {
        const ship = {
            hit: [],
            location: []
        };

        const directon = Math.random() < 0.5;
        let x = null;
        let y = x;

        if (directon) {
            // horizontal
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * (10 - shipSize));
        } else {
            // vertical
            x = Math.floor(Math.random() * (10 - shipSize));
            y = Math.floor(Math.random() * 10);

        }

        for (let i = 0; i < shipSize; i++) {
            if (directon) {
                ship.location.push(x + '' + (y+i))
            } else {
                ship.location.push((x+i) + '' + y)
            }
            ship.hit.push('');
        }


        if (this.checkCells(ship.location)) {
            return this.generateOptionsShip(shipSize)
        }


        this.addCell(ship.location)



        return ship;
    },

    checkCells(loc) {
        for (const coordin of loc) {
            if (this.cells.includes(coordin)) {
                return true;
            }
        }
    },
    addCell(loc) {
        for (let i = 0; i < loc.length; i++) {
            const startX = loc[i][0] - 1;
            for (let j = startX; j < startX + 3; j++) {
                const startY = loc[i][1] - 1;
                for (let z = startY; z < startY + 3; z++) {
                    if (j >= 0 && j < 10 && z >= 0 && z < 10) {
                        const coordinate = j + '' + z;

                        if (!this.cells.includes(coordinate)) {
                            this.cells.push(coordinate)
                        }
                    } 
                }
            }
        }
    }
}

const show = {
    hit(el) {
        this.changeClass(el, 'hit')
    },
    miss(el) {
        this.changeClass(el, 'miss')
    },
    dead(el) {
        this.changeClass(el, 'dead')
    },
    changeClass(el, val) {
        el.className = val;
    }
};

const fire = e => {
    const cell = e.target;

    if (cell.classList.length > 0 || cell.tagName.toLowerCase() !== 'td' || !game.gameStarted) {
        return;
    }

    show.miss(cell);
    stat.updateData = 'shot';


    for (let i = 0; i < game.ships.length; i++) {
        const ship = game.ships[i];
        const index = ship.location.indexOf(cell.id);
        if (index >= 0) {
            show.hit(cell);
            stat.updateData = 'hit';
            ship.hit[index] = 'x'
            const life = ship.hit.indexOf('');
            if (life < 0) {
                stat.updateData = 'dead'
                for (const c of ship.location) {
                    show.dead(document.getElementById(c))
                }
                game.shipCount--;
                if (game.shipCount < 1) {
                    game.gameStarted = false;
                    header.textContent = 'Game Over'
                    header.style.color = '#fea100'

                    if (stat.shot < stat.record || stat.record === 0) {
                        localStorage.setItem('rec', stat.shot);
                        stat.record = stat.shot;
                        stat.render();
                    }
                }
            }
        }
    }

}

const init = () => {
    enemy.addEventListener('click', fire);
    stat.render();

    game.renderShips();

    again.addEventListener('click', function() {
        location.reload();
    })

    record.addEventListener('dblclick', function() {
        localStorage.clear()
        stat.record = 0;
        stat.render();
    })

    console.log(game.ships)

}


init()