document.addEventListener('DOMContentLoaded', function() {

    // Get Guest Name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');

    if (guestName) {
        const guestNameStr = guestName.replace(/_/g, ' ');
        // Update all elements meant to display the guest's name
        const guestNameElements = document.querySelectorAll('.guest-name, .guest-name-display');
        guestNameElements.forEach(element => {
            element.textContent = guestNameStr;
        });
    }

    const openButton = document.getElementById('open-invitation');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const audio = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = '<i class="fas fa-play"></i>';
    const pauseIcon = '<i class="fas fa-pause"></i>';

    // 1. Buka Undangan
    openButton.addEventListener('click', () => {
        cover.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        // Putar musik saat undangan dibuka
        audio.play().catch(error => {
            // Autoplay was prevented. Show a play button.
            console.log("Autoplay was prevented. User must interact to play audio.");
        });
        playPauseBtn.innerHTML = pauseIcon;
    });

    // 2. Kontrol Musik
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = pauseIcon;
        } else {
            audio.pause();
            playPauseBtn.innerHTML = playIcon;
        }
    });

    // Update ikon saat musik selesai
    audio.addEventListener('ended', () => {
        playPauseBtn.innerHTML = playIcon;
    });

    // 3. Hitung Mundur
    const weddingDateStr = document.getElementById('wedding-date').innerText;
    const monthMap = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5, 
        'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    };
    // Extract day, month name, and year from the string "Sabtu, 6 Desember 2025"
    const dateParts = weddingDateStr.split(', ')[1].split(' '); // ["6", "Desember", "2025"]
    const day = parseInt(dateParts[0], 10);
    const monthName = dateParts[1];
    const year = parseInt(dateParts[2], 10);
    const month = monthMap[monthName];
    const countdownDate = new Date(year, month, day).getTime();

    const countdownFunction = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById('countdown').innerHTML = "<h2>Acara Telah Berlangsung</h2>";
        }
    }, 1000);

    // 4. Map Modal
    const mapModal = document.getElementById('map-modal');
    const mapIframe = document.getElementById('map-iframe');
    const closeButton = document.querySelector('.close-button');
    const mapButtons = document.querySelectorAll('.map-button');

    mapButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mapSrc = button.getAttribute('data-map-src');
            mapIframe.setAttribute('src', mapSrc);
            mapModal.classList.add('show');
        });
    });

    const closeModal = () => {
        mapModal.classList.remove('show');
        mapIframe.setAttribute('src', ''); // Hapus src untuk menghentikan peta
    };

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target == mapModal) {
            closeModal();
        }
    });

    // 5. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 6. Lightbox Gallery
    const galleryLinks = document.querySelectorAll('.gallery-grid a');
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.classList.add('lightbox');
    document.body.appendChild(lightbox);

    galleryLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            lightbox.classList.add('show');
            const img = document.createElement('img');
            img.src = link.href;
            const caption = document.createElement('p');
            caption.textContent = link.getAttribute('data-title');
            caption.classList.add('lightbox-caption');
            
            const content = document.createElement('div');
            content.classList.add('lightbox-content');
            content.appendChild(img);
            content.appendChild(caption);

            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }
            lightbox.appendChild(content);

            const closeButton = document.createElement('span');
            closeButton.classList.add('lightbox-close');
            closeButton.innerHTML = '&times;';
            content.appendChild(closeButton);

            closeButton.addEventListener('click', () => {
                lightbox.classList.remove('show');
            });
        });
    });

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
        }
    });

    // 7. RSVP Form Submission
    const rsvpForm = document.getElementById('rsvp-form');
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const guestName = this.elements['guestName'].value;
        const attendance = this.elements['attendance'].value;

        let confirmationMessage = `Terima kasih, ${guestName}! Konfirmasi Anda telah kami terima.`;
        if (attendance === 'no') {
            confirmationMessage = `Terima kasih, ${guestName}. Kami menghargai pemberitahuan Anda.`;
        }
        
        alert(confirmationMessage);
        this.reset();
    });

    // 8. Guestbook Form Submission
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookMessages = document.getElementById('guestbook-messages');

    guestbookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const senderName = this.elements['senderName'].value;
        const message = this.elements['message'].value;

        const messageElement = document.createElement('div');
        messageElement.classList.add('guestbook-message');

        const senderElement = document.createElement('p');
        senderElement.classList.add('sender');
        senderElement.textContent = senderName;

        const messageContentElement = document.createElement('p');
        messageContentElement.textContent = message;

        messageElement.appendChild(senderElement);
        messageElement.appendChild(messageContentElement);

        guestbookMessages.prepend(messageElement);

        alert('Terima kasih atas ucapan dan doa restunya!');
        this.reset();
    });

});
