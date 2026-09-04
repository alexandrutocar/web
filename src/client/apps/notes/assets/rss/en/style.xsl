<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
>
  <xsl:output method="html" version="2.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/atom:feed">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="atom:title"/> (Atom Feed)</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style type="text/css">
          @font-face {
              font-family: Tamzen;
              src: url(/fonts/Tamzen/8x16b.ttf);
          }

          * {
              font-family: Tamzen;
          }

          *, *::before, *::after {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background-color: #000;
            color: #fff;
            font-family: 'Tamzen', monospace;
            font-size: 14px;
            line-height: 1.6;
          }

          .container {
            max-width: 680px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
          }
          
          /* Banner */
          /* ------ */
          .banner {
            background-color: #fff;
            color: #000;
            padding: 16px 24px;
            margin-bottom: 2rem;
            font-size: 14px;
          }

          .banner a {
            color: #000;
            font-weight: 700;
          }

          .banner a:hover {
            background-image: linear-gradient(180deg, rgba(0,0,0,0) 10%, #000 0);
            color: #fff;
          }

          .banner strong {
            color: #000;
          }

          /* Feed */
          /* ---- */
          h1 {
            font-size: 32px;
            font-weight: 700;
            line-height: 1.25;
            margin: 0 0 0.5em 0;
          }

          @media (min-width: 768px) {
            h1 {
              font-family: 'Tamzen', monospace;
              font-size: 48px;
            }
          }
          
          .subtitle {
            font-family: 'Tamzen', cursive;
            font-size: 20px;
            color: #fff;
            padding: 16px 0;
            margin-bottom: 1em;
          }

          .link {
            display: inline-block;
            margin-bottom: 2rem;
            font-weight: 700;
            color: #fff;
            text-decoration: none;
            background-image: linear-gradient(180deg, rgba(0,0,0,0) 70%, #000 0);
            background-position: 4px bottom;
            background-repeat: no-repeat;
          }

          .link:hover {
            color: #000;
            background-image: linear-gradient(180deg, rgba(0,0,0,0) 10%, #fff 0);
          }

          h2 {
            font-size: 24px;
            text-transform: uppercase;
            font-weight: 700;
            line-height: 1.25;
            margin: 0 0 1em 0;
            letter-spacing: 0.05em;
          }
          
          /* Entries */
          /* ------- */
          .entries {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .entries li {
            border-bottom: 2px solid #1a1b1c;
            padding: 1.25em 0;
          }

          .entries li:last-child {
            border-bottom: none;
          }

          .entry-title {
            font-size: 18px;
            font-weight: 700;
            margin: 0 0 0.25em 0;
            line-height: 1.3;
          }

          .entry-title a {
            color: #fff;
            text-decoration: none;
            background-image: linear-gradient(180deg, rgba(0,0,0,0) 90%, #fff 0);
            background-position: 4px bottom;
            background-repeat: no-repeat;
          }

          .entry-title a:hover {
            color: #000;
            background-image: linear-gradient(180deg, rgba(0,0,0,0) 10%, #fff 0);
          }

          .entry-updated {
            font-size: 14px;
            color: #73808c;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 0.5em;
          }

          .entry-summary {
            color: #73808c;
            font-size: 14px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="banner">
            <strong>This is a web feed,</strong> also known as an RSS feed. You can <strong>subscribe</strong> by copying the URL from the address bar into your newsreader. Visit <a href="https://aboutfeeds.com">About Feeds</a> to get started. It's free!
          </div>

          <h1>
            <xsl:value-of select="atom:title"/>
          </h1>

          <div class="subtitle">
            <xsl:value-of select="atom:subtitle"/>
          </div>

          <a class="link">
            <xsl:attribute name="href">
              <xsl:value-of select="atom:link[@rel='alternate']/@href"/>
            </xsl:attribute>
            &#x2190; Visit <xsl:value-of select="atom:link[@rel='alternate']/@href"/>
          </a>

          <h2>Recent Articles</h2>

          <ul class="entries">
            <xsl:for-each select="atom:entry">
              <li>
                <h3 class="entry-title">
                  <a target="_blank">
                    <xsl:attribute name="href">
                      <xsl:value-of select="atom:link/@href"/>
                    </xsl:attribute>
                    <xsl:value-of select="atom:title"/>
                  </a>
                </h3>
                <div class="entry-updated">
                    <xsl:value-of select="substring(atom:updated, 9, 2)"/>
                    <xsl:text>.</xsl:text>
                    <xsl:value-of select="substring(atom:updated, 6, 2)"/>
                    <xsl:text>.</xsl:text>
                    <xsl:value-of select="substring(atom:updated, 1, 4)"/>
                    <xsl:text> at </xsl:text>
                    <xsl:value-of select="substring(atom:updated, 12, 2)"/>
                    <xsl:text>:</xsl:text>
                    <xsl:value-of select="substring(atom:updated, 15, 2)"/>
                    <xsl:text> (+00:00)</xsl:text>
                </div>
                <xsl:if test="atom:summary != ''">
                  <p class="entry-summary">
                    <xsl:value-of select="atom:summary"/>
                  </p>
                </xsl:if>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>