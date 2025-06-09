
  const links = document.querySelectorAll('.nav-principal a');
  const urlActual = window.location.pathname;

  links.forEach(link => {
    if (link.getAttribute('href') === urlActual.split('/').pop()) {
      link.classList.add('activo');
    }
  });

