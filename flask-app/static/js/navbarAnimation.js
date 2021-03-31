const navSlide = () => {
    const nav = document.querySelector('.nav-links');
    const burger = document.querySelector('.burger');
    
    const navLinks = document.querySelectorAll('.nav-links li');
   
    
    
    
    burger.addEventListener('click', () => {
        //Toggle Nav
        nav.classList.toggle('nav-active');
        //Burger Animation
        burger.classList.toggle('toggle');
    
    });

}

navSlide();