(function(jQuery) {
    jQuery.extend(true, jQuery.fn, {
		/**
		 * jQuery.fn.sortElements
		 * --------------
		 * @param Function comparator:
		 *   Exactly the same behaviour as [1,2,3].sort(comparator)
		 *   
		 * @param Function getSortable
		 *   A function that should return the element that is
		 *   to be sorted. The comparator will run on the
		 *   current collection, but you may want the actual
		 *   resulting sort to occur on a parent or another
		 *   associated element.
		 *   
		 *   E.g. $('td').sortElements({'comparator':"myComparator"}, function(){
		 *      return this.parentNode; 
		 *   })
		 *   
		 *   The <td>'s parent (<tr>) will be sorted instead
		 *   of the <td> itself.
		 */
		sortElements: function(config,getSortable){
			var defaults = {
				"default" : function(a, b){
						return jQuery(a).text() > jQuery(b).text() ? 1 : -1;
					},
				"numeric" : function(a, b){
						return parseInt(jQuery(a).text(), 10) > parseInt(jQuery(b).text(), 10) ? 1 : -1;
					},
				"auto" : function(a, b){
					a = jQuery(a).text();
					b = jQuery(b).text();
				
					return (
						isNaN(a) || isNaN(b) ?
						a > b : +a > +b
					) ?
						inverse ? -1 : 1 :
						inverse ? 1 : -1;
					}
			}
			config = config || {};
			var inverse = config.inverse || false;
			var sort = [].sort;
			var comparator = defaults[config.comparator] || config.comparator || defaults['default'];
			var getSortable = getSortable || function(){return this;};
			var placements = this.map(function(){
				var sortElement = getSortable.call(this),
					parentNode = sortElement.parentNode,
					// Since the element itself will change position, we have
					// to have some way of storing its original position in
					// the DOM. The easiest way is to have a 'flag' node:
					nextSibling = parentNode.insertBefore(
						document.createTextNode(''),
						sortElement.nextSibling
					);
				return function() {
					if (parentNode === this) {
						throw new Error(
							"You can't sort elements if any one is a descendant of another."
						);
					}
					// Insert before flag:
					parentNode.insertBefore(this, nextSibling);
					// Remove flag:
					parentNode.removeChild(nextSibling);
				};
			});
			return sort.call(this, comparator).each(function(i){
				placements[i].call(getSortable.call(this));
			})
		}
    });
})(jQuery);