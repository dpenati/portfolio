async function loadUseCases() {
    try {
        const res = await fetch('https://dpenati.github.io/portfolio/useCases/data.json'); // <-- your JSON file
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        window.articles = await res.json();  
    } catch (err) {
      console.error  (err);
    }
}

loadUseCases ();
