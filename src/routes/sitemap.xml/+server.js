export async function GET() {
    const baseUrl = 'localhost:5173'; // Substitua pelo domínio do seu site

    const staticRoutes = [
        '/',
        '/about',
        '/contact',
        // Adicione outras rotas estáticas aqui
    ];

    // Exemplo de rotas dinâmicas que você pode obter de uma API, banco de dados, etc.
    const dynamicRoutes = []//await getRoutes(); // getRoutes() deve retornar um array de strings com as URLs

    const urls = [...staticRoutes, ...dynamicRoutes];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="/sitemap.xslt"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls
                .map(
                    (url) => `
            <url>
                <loc>${baseUrl}${url}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
            </url>
        `
                )
                .join('')}
    </urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
}


async function getRoutes() {
    // Exemplo de rotas dinâmicas (pode vir de uma API ou banco de dados)
    return [
        // '/blog/post-1',
        // '/blog/post-2',
        // '/products/item-1',
        // '/products/item-2'
        // Adicione outras rotas dinâmicas conforme necessário
    ];
}