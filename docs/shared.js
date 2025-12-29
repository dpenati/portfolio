async function loadData() {
    try {
        const res = await fetch('https://dpenati.github.io/portfolio/usecases.json'); // <-- your JSON file
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        articles = await res.json();  
        render();
    } catch (err) {
      console.error  (err);
    }
}

loadData ();
