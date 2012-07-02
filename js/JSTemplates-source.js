/*
 * 	jQuery namspaced function $.JSTemplates.substitute is a simple paternized substitution
 * 	based on dojo.string.substitute with all dependencies removed and barebones functionality.
 *  Added ability to include map traversal with full path keys such as ${key.child.child}
 * 
 * Paramaters:
 * 	template - HTML String with patterns embedded of the form ${key} or ${key.child.child}
 *	map - Object containing keys to substitute in.
 *
 * Returns:
 * 	String - final string after pattern substitution completes
 */
/* ===============================
 * 	Inline Template Spec
 * ===============================
 * 
 * 	<template data='map.full.path.key'>
 * 		${data.relative.path.key}
 * 	</template>
 * 
 */
( function ( $ ) {
	//namespace for JSTemplate helper functions
	if( $.JSTemplates === undefined ) {
		$.JSTemplates = {};
	}
	
	$.JSTemplates.substitute = function( template, map ){
		//Replace instances of ${key.child.child} pattern
		//Template nesting pattern ${templateID:key}
		var html = $.JSTemplates.newEvalInlineTemplates( template, map ); //template; //$.JSTemplates.evalInlineTemplates( template, map );
		
		html = html.replace(/\$\{([^\s\}]+)(?:([^\s\}]+))?\}/g,
			function(match, key ){
				var nestedTmpl	= key.split(":"),
					dataKey		= nestedTmpl[ nestedTmpl.length - 1 ],
					value 		= $.JSTemplates.resolveKey( dataKey, map );
				
				if( nestedTmpl.length > 1 ) { //nested template, apply it to the specified data
					var $nestedTmpl = $("#" + nestedTmpl[0]);
					value = $("<div></div>").append( $nestedTmpl.applyTemplate( value ) ).html();
				}
				
				return value.toString();
			}
		);
		return html;
	};
	//deprecated - caused errors when template data was inserted into html element attributes
	$.JSTemplates.evalInlineTemplates = function ( html, map ) {
		var $html		= $(html),
			templates	= $html.find("template").get().reverse(), //reverse order array of templates to process child elements first
			$templates 	= $(templates);
		
		$templates.each( function () {
			var $tmpl	= $(this),
				dataKey	= $tmpl.attr("data"), 						//TODO: put in error checking
				data	= $.JSTemplates.resolveKey( dataKey, map ),
				$result = $tmpl.applyTemplate( data ); //apply a template substitution
			
			$tmpl.after( $result )
				.remove();
		});
		
		return $("<div></div>").append($html).html(); //wrap to extract the applied template results
	};
	//	New Inline Template evaluation - The jQuery approach caused errors in some browsers by replacing 
	// 	template tags erroneously when creating the $html object. This lead to some data not being inserted
	// 	into the template. This code is quick and dirty, possibly with errors.
	$.JSTemplates.newEvalInlineTemplates = function ( html, map ) {
		var startTags = html.split( "<template" ); // /<template(\w)>/g  //array of templates split by starting tag
		
		for( var i = startTags.length-1; i >= 0; i--) {
			var closeTags = startTags[i].split("</template>");
			var element = "";
			var dataKey = "";
			var value = "";
			
			if( closeTags.length > 1 ) {
				element 	= startTags.pop().replace("</template>", "");// + closeTags[0];
				element = element.replace(/data\='([^\s]+)'>/, function( match, key ) {
					dataKey = key;
					return "";
				});  	//extract template elements data attribute
				value 		= $.JSTemplates.resolveKey( dataKey, map ); //translate data attribute into map data
				element 	= $.JSTemplates.substitute( element, value ); //treat element as template against value
			
				startTags[i-1] += element;
				if( closeTags.length > 2 ) { //nested inline template
					startTags[i-1] += closeTags.join("</template>"); //attach remaining close fragments
				}
			}
		}
		return startTags.join("");
	};
	
	$.JSTemplates.resolveKey = function ( dataKey, map ) { //translates a key to its value in map
		var splitKey	= dataKey.split("."),
			value 		= map,
			temp 		= "";
		
		for( var SK = 0; SK < splitKey.length; SK++ ) { //Handle map traversal 
			temp = splitKey[SK];	//cache current key
			if( value[temp] != undefined ) {
				value = value[temp];
			}
			else {	//key maps to an invalid location in map, break out
				value = "";
				console ? console.log("Key: " + dataKey + " element " + temp + " undefined in template map") : null;
				break;
			} 
		}
		
		return value;
	};
})( jQuery );/*
 * applyTemplate - jQuery Plugin function interprets this as a JSTemplate element and
 * 	performs a template substitution with the provided map
 * 
 * Paramaters:
 * 	data - 	If Array, treated as a collection of maps to iterate.( Object[] )
 * 			If Object treat as a single map. ( Object )
 *
 * Returns:
 * 	String - final string after pattern substitution completes
 * 
 * Usage:
 * 	$("#my-template").applyTemplate( data );
 */
( function ( $ ) {
	$.fn.applyTemplate = function ( data ) {
		var template 	= this.html(),
			html 		= "",
			i;
		
		if( data instanceof Array ) { //treat as an array of maps
			for ( i in data ) {
				html += $.JSTemplates.substitute( template, data[i] );
			}
		} 
		else {
			html = $.JSTemplates.substitute( template, data );
		}
		return $(html);
	};
})( jQuery );