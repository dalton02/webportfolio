<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" />
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <style>
          table, .component{
              width: 100%;
              max-width: 800px;
          }
          .component{
              display: flex;
              flex-direction: column;
              gap: 32px;
              margin-top: 88px;
              padding: 0px 32px;
              margin: auto;
              position: relative;
          }
          
          h2{
              text-align: left;
          }
          thead{
              border-width: 0 0 1px 0;
              border-style: solid;
              border-color: #121212;
          }
          tr{
              width: 100%;
              display: flex;
              justify-content: space-between;
          }
          tr:nth-child(even){
              background: #eee;
          }
          td{
              font-size: 14px;
              color: #121212;
              text-decoration: none;
              padding: 4px;
              word-wrap: break-word;
              display: flex;
              align-items: center;
              justify-content: center;
          }
          a{
              color: #121212;
              word-wrap: break-word;
              word-break: break-all;
          }
          tr:hover:not(first-child), tr:hover td a{
              color: black;
              text-decoration: underline;
              cursor: pointer;
          }

          @media (max-width: 768px) {
              .component{
                  padding: 0px 16px;
                  margin: auto;
                  position: relative;
              }
          }

          @media(max-width: 500px){
              td{
                  max-width: 50%;
              }
          }
        </style>
      </head>
      <body>
        <h2>Sitemap Index</h2>
        <table border="0">
          <thead>
            <tr>
              <th>URL</th>
              <th>Última Modificação</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="urlset/url">
              <tr>
                <td>
                  <a href="{loc}">
                    <xsl:value-of select="loc" />
                  </a>
                </td>
                <td><xsl:value-of select="lastmod" /></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>