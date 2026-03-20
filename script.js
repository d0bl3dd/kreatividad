<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documento Profesional</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #2563eb;
            --text: #1e293b;
            --bg: #ffffff;
            --bg-alt: #f8fafc;
            --border: #e2e8f0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--text);
            line-height: 1.7;
            background: var(--bg);
        }

        /* Progress Bar */
        #progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--primary);
            width: 0%;
            z-index: 9999;
            transition: width 0.1s;
        }

        /* Layout */
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        /* Typography */
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--text);
        }

        h2 {
            font-size: 1.8rem;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: var(--text);
        }

        h3 {
            font-size: 1.3rem;
            margin-top: 2rem;
            margin-bottom: 0.8rem;
        }

        p {
            margin-bottom: 1.2rem;
            text-align: justify;
        }

        /* Table of Contents */
        #toc {
            background: var(--bg-alt);
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            border: 1px solid var(--border);
        }

        #toc h3 {
            margin-top: 0;
            font-size: 1.1rem;
        }

        #toc ul {
            list-style: none;
            padding-left: 0;
        }

        #toc li {
            margin: 8px 0;
        }

        #toc a {
            color: #64748b;
            text-decoration: none;
            font-size: 0.95rem;
            display: block;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;
        }

        #toc a:hover, #toc a.active {
            color: var(--primary);
            background: rgba(37, 99, 235, 0.1);
        }

        #toc a.active {
            font-weight: 600;
        }

        /* Code Blocks */
        pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            position: relative;
        }

        code {
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
        }

        .copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255,255,255,0.1);
            border: none;
            color: #fff;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            opacity: 0;
            transition: opacity 0.2s;
        }

        pre:hover .copy-btn {
            opacity: 1;
        }

        .copy-btn:hover {
            background: rgba(255,255,255,0.2);
        }

        .copy-btn.copied {
            background: #10b981;
        }

        /* Images */
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            cursor: zoom-in;
            transition: transform 0.3s;
        }

        img:hover {
            transform: scale(1.02);
        }

        /* Lightbox */
        #lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            justify-content: center;
            align-items: center;
        }

        #lightbox.active {
            display: flex;
        }

        #lightbox img {
            max-width: 90%;
            max-height: 90vh;
            object-fit: contain;
            cursor: default;
        }

        #lightbox .close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 40px;
            cursor: pointer;
            line-height: 1;
        }

        /* Scroll to top */
        #scroll-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(37,99,235,0.3);
        }

        #scroll-top.visible {
            opacity: 1;
            visibility: visible;
        }

        #scroll-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(37,99,235,0.4);
        }

        /* Animations */
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Print Button */
        #print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg);
            border: 1px solid var(--border);
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: var(--shadow);
            transition: all 0.2s;
        }

        #print-btn:hover {
            background: var(--bg-alt);
        }

        @media print {
            #progress-bar, #toc, #scroll-top, #print-btn, .copy-btn {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <!-- Progress Bar -->
    <div id="progress-bar"></div>

    <!-- Print Button -->
    <button id="print-btn" onclick="window.print()">
        🖨️ Imprimir / PDF
    </button>

    <!-- Lightbox -->
    <div id="lightbox" onclick="closeLightbox()">
        <span class="close">&times;</span>
        <img src="" alt="" id="lightbox-img">
    </div>

    <!-- Scroll to Top -->
    <button id="scroll-top" onclick="scrollToTop()">↑</button>

    <!-- Main Content -->
    <div class="container">
        <h1>Mi Documento Profesional</h1>
        
        <p>Este es un documento de ejemplo con todas las funcionalidades implementadas.</p>

        <!-- Table of Contents -->
        <nav id="toc">
            <h3>📑 Contenido</h3>
            <ul id="toc-list"></ul>
        </nav>

        <section class="fade-in">
            <h2 id="introduccion">1. Introducción</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </section>

        <section class="fade-in">
            <h2 id="desarrollo">2. Desarrollo</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            
            <h3 id="subtema-1">2.1 Subtema Importante</h3>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            
            <pre><code>function ejemplo() {
    console.log("Código de ejemplo");
    return true;
}</code><button class="copy-btn" onclick="copyCode(this)">Copiar</button></pre>
            
            <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
        </section>

        <section class="fade-in">
            <h2 id="imagenes">3. Imágenes</h2>
            <p>Haz clic en cualquier imagen para ampliarla:</p>
            <img src="https://via.placeholder.com/600x400/2563eb/ffffff?text=Imagen+de+Ejemplo" alt="Ejemplo" onclick="openLightbox(this)">
            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.</p>
        </section>

        <section class="fade-in">
            <h2 id="conclusiones">4. Conclusiones</h2>
            <p>Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.</p>
            <p>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
        </section>

        <section class="fade-in">
            <h2 id="referencias">5. Referencias</h2>
            <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
        </section>
    </div>

    <script>
        // ==========================================
        // PROGRESS BAR
        // ==========================================
        function updateProgressBar() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            document.getElementById('progress-bar').style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgressBar);

        // ==========================================
        // TABLE OF CONTENTS
        // ==========================================
        function generateTOC() {
            const headings = document.querySelectorAll('h2, h3');
            const tocList = document.getElementById('toc-list');
            
            headings.forEach(function(heading, index) {
                // Add ID if missing
                if (!heading.id) {
                    heading.id = 'section-' + index;
                }
                
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#' + heading.id;
                a.textContent = heading.textContent;
                a.onclick = function(e) {
                    e.preventDefault();
                    document.getElementById(heading.id).scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, null, '#' + heading.id);
                };
                
                // Indent H3
                if (heading.tagName === 'H3') {
                    li.style.paddingLeft = '20px';
                }
                
                li.appendChild(a);
                tocList.appendChild(li);
            });
        }

        // Highlight active section
        function highlightTOC() {
            const headings = document.querySelectorAll('h2, h3');
            const links = document.querySelectorAll('#toc a');
            
            let current = '';
            headings.forEach(function(heading) {
                const sectionTop = heading.offsetTop;
                if (pageYOffset >= sectionTop - 100) {
                    current = heading.getAttribute('id');
                }
            });
            
            links.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', highlightTOC);

        // ==========================================
        // SCROLL TO TOP
        // ==========================================
        function toggleScrollTop() {
            const btn = document.getElementById('scroll-top');
            if (window.pageYOffset > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        window.addEventListener('scroll', toggleScrollTop);

        // ==========================================
        // COPY CODE
        // ==========================================
        function copyCode(button) {
            const pre = button.parentElement;
            const code = pre.querySelector('code');
            const text = code.textContent;
            
            // Create temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                button.textContent = '¡Copiado!';
                button.classList.add('copied');
                
                setTimeout(function() {
                    button.textContent = 'Copiar';
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Error al copiar:', err);
            }
            
            document.body.removeChild(textarea);
        }

        // ==========================================
        // LIGHTBOX
        // ==========================================
        function openLightbox(img) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // ==========================================
        // FADE IN ANIMATION
        // ==========================================
        function setupFadeIn() {
            const elements = document.querySelectorAll('.fade-in');
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            elements.forEach(function(el) {
                observer.observe(el);
            });
        }

        // ==========================================
        // INITIALIZE
        // ==========================================
        document.addEventListener('DOMContentLoaded', function() {
            generateTOC();
            setupFadeIn();
            updateProgressBar();
            highlightTOC();
            
            console.log('✅ Documento inicializado correctamente');
        });
    </script>
</body>
</html>
