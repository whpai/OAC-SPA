## IIS 設定`web.config`

* 為了對應:
	* service worker跨域載入圖片被content-security-policy擋下
		* 針對service worker設定`content-security-policy: connect-src *;`
	* chrome新版快取策略造成更新靜態資源時仍使用舊的列表
		* 針對service worker跟資源列表設定`Cache-Control: public, no-cache, max-age=0, must-revalidate`
* 加入下面這段:
	* `sw.js` 為service worker的檔名
	* `sw-manifest.js` 為靜態資源列表的檔名

```
	<rewrite>
		<outboundRules>
			<rule name="Set sw.js HTTP response header" enabled="true" stopProcessing="false">
				<match serverVariable="RESPONSE_content_security_policy" pattern=".*" />
				<conditions>
					<add input="{REQUEST_URI}" pattern="sw\.js$" />
				</conditions>
				<action type="Rewrite" value="connect-src *;" />
			</rule>
			<rule name="forec-check sw.js" enabled="true" stopProcessing="false">
				<match serverVariable="RESPONSE_Cache_Control" pattern=".*" />
				<conditions>
					<add input="{REQUEST_URI}" pattern="sw\.js$" />
				</conditions>
				<action type="Rewrite" value="public, no-cache, max-age=0, must-revalidate" />
			</rule>
			<rule name="forec-check sw-manifest.js" enabled="true" stopProcessing="false">
				<match serverVariable="RESPONSE_Cache_Control" pattern=".*" />
				<conditions>
					<add input="{REQUEST_URI}" pattern="sw-manifest\.js$" />
				</conditions>
				<action type="Rewrite" value="public, no-cache, max-age=0, must-revalidate" />
			</rule>
		</outboundRules>
	</rewrite>
```

