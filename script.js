'use strict';

const btnScrollTo=document.querySelector('.btn--scroll-to');
const section1=document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav=document.querySelector('.nav');
const tabs=document.querySelectorAll('.operations__tab');
const tabsContainer=document.querySelectorAll('.operations__tab-container');
const tabsContent=document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window





const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn=>btn.addEventListener('click', openModal));



btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});



//button scrolling
btnScrollTo.addEventListener('click',function(e){
  const s1coords=section1.getBoundingClientRect();
  console.log(s1coords)

  console.log(e.target.getBoundingClientRect())

  //scrolling
  //window.scrollTo(s1coords.left+window.pageXOffset,s1coords.top +window.pageYOffset)

  //window.scrollTo({
    //left:s1coords.left+window.pageXOffset,
    //top:s1coords.top +window.pageYOffset,
    //behavior='smooth',
  //});
  section1.scrollIntoView({behavior:'smooth'})
});

//Page Navigation
/*
document.querySelectorAll('.nav__ link').forEach(function(el){
el.addEventListener('click',function(e){
  e.preventDefault();
  const id=this.getAttribute('href');
  console.log(id)
  document.querySelector(id).scrollIntoView({behavior:'smooth'})
});
});
*/
//1.  Add event listener to common parent element
//2.Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();

  //Matching Strategy
  if(e.target.classList.contains('nav__link')){
  const id=e.target.getAttribute('href');
  console.log(id)
  document.querySelector(id).scrollIntoView({behavior:'smooth'})
  }

});

//Tabbed Component
/*
const tabs=document.querySelectorAll('.operations__tab');
const tabsContainer=document.querySelectorAll('.operations__tab-container');
const tabsContent=document.querySelectorAll('.operations__content');
*
tabsContainer.addEventListener('click', function(e) {
  const clicked=e.target.closest('.operations__tab');
  console.log(clicked)
});
*/
//menu fade animation
const handHover= function(e,opacity){
  if(e.target.classList.contains('nav__link')){
    const link=e.target;
    const siblings= link.closest('.nav').querySelectorAll('.nav__link');
    const logo=link.closest('.nav').querySelector('img');
 
    siblings.forEach(el=>{
      if(el!==link) el.style.opacity=opacity;
    });
    logo.style.opacity=opacity;
  }

}
//passing "argument " into handler  
nav.addEventListener('mouseover',handHover.bind(0.5));
 

nav.addEventListener('mouseout',handHover.bind(1));

//sticky navigation
/*
const initialCoords=section1.getBoundingClientRect();

console.log(initialCoords);

window.addEventListener('scroll',function(e){
  console.log(window.scrollY);

  if(window.scrollY>initialCoords.top)nav.classList.add('sticky');
  else
  nav.classList.add('sticky');

})
*/
//sticky navigation: Intersectrion observer api
/*
const obsCallback=function(entries,observer){
  entries.forEach(entry=>{
    console.log(entry);
  })

}

const obsOptions={
  root:null,
  threshold:[0,0.2]
}


const observer =new IntersectionObserver(obsCallback,obsOptions);
observer.observe(section1);
*/

const header=document.querySelector('.header');

const navHeight=nav.getBoundingClientRect().height;
console.log(navHeight)

const stickyNav=function(entries){
  const[entry]=entries;
  console.log(entry);

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver=new IntersectionObserver(stickyNav,{
  root:null,
  threshold:0,
  rootMargin:`-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal sections
const allSections=document.querySelectorAll('.section')
const revealSection=function(entries,observer){
    const [entry]=entries;
    //console.log(entry)

    if(!entry.isIntersecting)return;
    entry.target.classList.remove('section--hidden')
    observer.unobserve(entry.target)


}

const sectionObserver=new IntersectionObserver(revealSection,{
 root:null,
 threshold:0.15,
})

allSections.forEach(function(section){
  sectionObserver.observe(section);
  //section.classList.add('section--hidden')

})

//Lazy Loading Images
const imgTarget=document.querySelectorAll('img[data-src]');

const loadImg=function(entries,observer){
  const [entry]=entries;
  console.log(entry);

  if(!entry.isIntersecting)return;

  //Replace src with data-src
  entry.target.src=entry.target.dataset.src;

  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target)

}

const imgObserver=new IntersectionObserver(loadImg,{
  root:null,
  threshold:0,
  rootMargin:'200px',
});
imgTarget.forEach(img=>imgObserver.observe(img))

//Slider 
const slider=function(){
const slides=document.querySelectorAll('.slide');
const btnLeft=document.querySelector('.slider__btn--left');
const btnRight=document.querySelector('.slider__btn--right');
const dotContainer=document.querySelector('.dots');

let curSlide=0;
const maxSlide=slides.length;



//const slider=document.querySelector('.slider');
//slider.style.transform='scale(0.2) translateX(-800px)';
//slider.style.transform='visible';


//Functions
const createDots=function(){
  
  slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`);
  });

};


const activateDot=function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot=>dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};



const goToSlide=function(slide){
  slides.forEach((s,i)=> s.style.transform=`translateX(${100*(i-curSlide)}%)`);
};

 

//Next Slide
const nextSlide=function(){
  if(curSlide===maxSlide-1){
    curSlide=0;
  } else{
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide=function(){
  if(curSlide===0){
    curSlide=maxSlide-1;
  }
  else{

    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const init=function(){
  createDots();
  goToSlide(0);
  activateDot(0);
}
init();


btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',prevSlide);

//Slides from Keyboard
document.addEventListener('keydown',function(e){
  console.log(e);
  if(e.key==='ArrowLeft')prevSlide();
  e.key==='ArrowRight' && nextSlide();
});
 

dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide}=e.target.dataset;
    goToSlide(slide);
    activateDot(slide);

  }
});
};
slider();





//selecting elemets
/*
console.log(document.documentElement)
console.log(document.head)
const header=document.querySelector('.header')
*/

//creating and inserting elements
//const message=document.createElement('div');
//message.classList.add('cookie-message');
//message.innerHTML='we used cookies for more functionality and analytics.<button //class="btn btn--close-cookie">Got it!</button>'

//header.prepend(message)
//header.append(message)


//header.before(message)
//header.after(message)

//deleting elements
/*
document.querySelector('.btn--close-cookie').addEventListener('click',function(){
  message.parentElement.removeChild(message);
})
//styles
message.style.backgroundColor='#37383d';
message.style.width='120%'

console.log(message.style.color);
console.log(message.addEventListener.backgroundColor);

console.log(getComputedStyle(message).color)
console.log(getComputedStyle(message).height)

message.style.height=Number.parseFloat(getComputedStyle(message).height,10)+30+'px';

document.documentElement.style.setProperty('--color-primary','orangered');

//Attributes
const logo=document.querySelector('.nav__logo')
console.log(logo.src)
console.log(logo.alt)
console.log(logo.className)

//Non-Standard
console.log(logo.getAttribute('designer'))
logo.setAttribute('company',' Bankist')

console.log(logo.src)
console.log(logo.getAttribute('src'))

//Data Attributes
console.log(logo.dataset.versionNumber)

//CLASSES
logo.classList.add('c','j');
logo.classList.remove('c','j');
logo.classList.toggle('c');
logo.classList.contains('c');//not includes

//dont use this
logo.className='jonas'

*/
/*

const btnScrollTo=document.querySelector('.btn--scroll-to');
const section1=document.querySelector('#section--1');

btnScrollTo.addEventListener('click',function(e){
  const s1coords=section1.getBoundingClientRect();
  console.log(s1coords)

  console.log(e.target.getBoundingClientRect())

  //scrolling
  //window.scrollTo(s1coords.left+window.pageXOffset,s1coords.top +window.pageYOffset)

  //window.scrollTo({
    //left:s1coords.left+window.pageXOffset,
    //top:s1coords.top +window.pageYOffset,
    //behavior='smooth',
  //});
  section1.scrollIntoView({behavior:'smooth'})
});
/*
const h1=document.querySelector('h1');
h1.addEventListener('mouseenter',function(e){
  alert('you have entered the heading')
})

h1.onmouseenter=function(e){
  alert('you have entered the heading')
} */
/*
const randomInt= (min,max)=>Math.floor(Math.random()*(max-min+1)+min);
const randomColor=() => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;


document.querySelector('.nav__link').addEventListener('click',function(e){
  this.style.backgroundColor=randomColor();
  console.log('link', e.target,e.currentTarget)

  //stop propragation
  //  e.stopPropagation();
})

document.querySelector('.nav__links').addEventListener('click',function(e){
  this.style.backgroundColor=randomColor();
  console.log('conatainer', e.target,e.currentTarget)
   
    
})

document.querySelector('.nav').addEventListener('click',function(e){
  this.style.backgroundColor=randomColor();
  console.log('nav', e.target,e.currentTarget)
  })
 

*/
/*
const h1=document.querySelector('h1');

//Going Downwards: Child 
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
console.log(h1.firstElementChild)
console.log(h1.lastElementChild)
h1.firstElementChild.style.color='white';
h1.lastElementChild.style.color='orangered'

//Going Upwards:Parent
console.log(h1.parentNode);

h1.closest('.header').style.background='var(--gradient-secondary)'

//Selecting sideways:Siblings
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  if(el!==h1) el.style.transform='scale(0.5)';
  

})
*/


