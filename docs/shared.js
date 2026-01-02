async function loadUseCases() {
    try {
        const res = await fetch('https://dpenati.github.io/portfolio/useCases/data.json'); // <-- your JSON file
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
       window.useCases = await res.json();  
       window.dispatchEvent(new CustomEvent("useCases:loaded", { detail: window.useCases }));
    } catch (err) {
      console.error  (err);
    }
}

loadUseCases ();
