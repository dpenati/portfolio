async function loadUseCases() {
    try {
        const res = await fetch('https://dpenati.github.io/portfolio/useCases/data.json'); // <-- your JSON file
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        articles = await res.json();  
        console.log (articles);
        render();
    } catch (err) {
      console.error  (err);
    }
}

loadDUseCases ();
