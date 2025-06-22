if (location.hostname.endsWith('github.io')) {
  const links = [...document.head.querySelectorAll('link[rel="stylesheet"]')];

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('data:')) {
      const separator = href.includes('?') ? '&' : '?';
      const bustedHref = `${href}${separator}v=${new Date().getTime()}`;
      link.setAttribute('href', bustedHref);
    }
  });
}