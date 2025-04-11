// let audioElement = new Audio('song/Ishq-Mein.mp3');
// let audioElement = new Audio(songs[0].filepath);
// let songIndex=0;
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let songItem =Array.from(document.getElementsByClassName('songItem'));

// let imgChange=document.getElementsByClassName('play');

let songs = [
    {songName: 'Ishq Mein', coverPath: 'covers/ishq-Mein.jpg', filepath:"song/ishq-Mein.mp3"},
    {songName: 'Sanam-Teri-Kasam', coverPath: 'covers/sanam-Teri-Kasam.jpg' , filepath:"song/sanam-Teri-Kasam.mp3"},
    {songName: 'Khamoshiyan', coverPath: 'covers/khamishiya.jpeg' , filepath:"song/khamoshiyan.mp3"},
    {songName: 'Bekhayali (Arijit Singh Version)', coverPath: 'covers/bekhyali.jpg' , filepath:"song/bekhayali.mp3"},
    {songName: 'ShoorVeer', coverPath: 'covers/shoorveer.jpg', filepath:"song/shoorveer.mp3"},
    {songName: 'Mareez_E_Ishq', coverPath: 'covers/mareez-e-ishq.jpg', filepath:"song/mareez-e-ishq.mp3"},
]

let audioElement = new Audio(songs[0].filepath);


// Update UI with song data
songItem.forEach((element, index) => {
    element.getElementsByTagName("img")[0].src = songs[index].coverPath;
    element.getElementsByTagName("span")[0].innerText = songs[index].songName;
    
    // Add click event to play the selected song
    element.getElementsByClassName('songListPlay')[0].addEventListener('click', () => {
        audioElement.src = songs[index].filepath;
        audioElement.currentTime = 0;
        audioElement.play();

        // Update main controls (optional)
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        gif.style.opacity = 1;

        // ✅ Add this line to update song info title
     document.getElementById('currentSongName').innerText = songs[index].songName;

    });
});

// Handel The play Pause Button
masterPlay.addEventListener('click' , ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play();

        masterPlay.classList.remove('fa-circle-play'); 
        masterPlay.classList.add('fa-circle-pause');
        gif.style.opacity = 1;
    } 
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
        gif.style.opacity = 0;
    }
})


//Seekbar Hnadla The Progress Bar 
audioElement.addEventListener('timeupdate', ()=>{
    console.log('timeUpdate');
    // Update SeekBar
    progress = parseInt((audioElement.currentTime/audioElement.duration)*100)
    // console.log(progress);
    myProgressBar.value = progress;

})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = (myProgressBar.value * audioElement.duration )/100 ;
});