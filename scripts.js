const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isSeeking: false, 
    isRandom: false,
    isRepeat: false,
    currentPlayingSong: $('.song'),
    songs: [
        {
            name: "Ballerina Girl",
            singer: "Kano",
            path: "./assets/music/BallerinaGirl.flac",
            image: "./assets/img/Merry.jpg",
        },
        {
            name: "Kimi no Maboroshi",
            singer: "Kano",
            path: "./assets/music/KiminoMaboroshi.flac",
            image: "./assets/img/Merry.jpg",
        },
        {
            name: "Kokoro Nashi",
            singer: "Kano",
            path: "./assets/music/KokoroNashi.flac",
            image: "./assets/img/Merry.jpg",
        },
        {
            name: "Meryuu",
            singer: "Kano",
            path: "./assets/music/Meryuu.flac",
            image: "./assets/img/Merry.jpg",
        },
        {
            name: "Milk Crown on Sonnetica",
            singer: "Kano",
            path: "./assets/music/MilkCrownonSonnetica.flac",
            image: "./assets/img/Merry.jpg",
        },
        {
            name: "Platonic Love",
            singer: "Kano",
            path: "./assets/music/PlatonicLove.flac",
            image: "./assets/img/Merry.jpg",
        },
        {
            name: "Sukisuki Zetchoushou",
            singer: "Kano",
            path: "./assets/music/SukisukiZetchoushou.flac",
            image: "./assets/img/Merry.jpg",
        },
    ],
    playedSongIndices: [],
    
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song song-${index}" data-index="${index}">
                    <div
                        class="thumb"
                        style="
                        background-image: url('${song.image}');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join("\n")
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth
        const _this = this

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = function() {
            console.log(_this.currentPlayingSong)
            console.log($('.song-0'))
            _this.currentPlayingSong.classList.remove('active')
            _this.currentPlayingSong = $(`.song-${_this.currentIndex}`)
            _this.currentPlayingSong.classList.add('active')
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = function() {
            if (!_this.isSeeking && audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        progress.onmousedown = function() {
            _this.isSeeking = true
        }

        // progress.onmouseup = function() {
        //     _this.isSeeking = false
        // }
     
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
            _this.isSeeking = false  
        }

        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        }

        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode) {
                _this.currentIndex = songNode.dataset.index
                _this.loadCurrentSong()
                audio.play()
            }
        }
    },

    loadCurrentSong: function() {      
        if (this.playedSongIndices.length === this.songs.length - 1) {
            this.playedSongIndices = []
        }
        this.playedSongIndices.push(this.currentIndex)

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex || this.playedSongIndices.includes(newIndex))

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        this.defineProperties()

        this.handleEvents()
        
        this.loadCurrentSong()

        this.render()
    }
}   


app.start()