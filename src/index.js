var splitReg = /\s*,\s*/;
var widthReg = /(?:^|\s+)(?:\d*\.)?\d+(?:\s*\/|)(?:\s+\d+){1,}$/;
var rowReg = /\s*\/\s*/;
var blockReg = /\s+/;

export default function slayout (data) {

	var selector = data.selector;
	var layouts = parseValue(data.value);

	var blockLayouts = getCascadingWidths(calculateWidths(layouts));
	var widthGroups = groupWidths(blockLayouts);

	var mediaRules = widthGroups.map(
		(widths, widthIndex) => Object.keys(widths).map(
			(width) => ({
				selector: widths[width].map((index) => {
					var n = index + 1;
					// Repeat with n+ if block is the last in the layout.
					if (index === blockLayouts[widthIndex].length - 1) {
						n = `n+${n}`; 
					}
					return `${selector} > :nth-child(${n})`;
				}).join(", "),
				props: {"width": `${width}%`}
			})
		)
	);

	var rules = [
		{
			selector,
			props: {
				"margin-left": "-10px",
				"margin-right": "-10px"
			}
		},
		{
			selector: `${selector}:after`,
			props: {
				"content": "\"\"",
				"display": "table",
				"clear": "both"
			}
		},
		{
			selector: `${selector} > *`,
			props: {
				"box-sizing": "border-box",
				"padding-left": "10px",
				"padding-right": "10px",
				"width": "100%",
				"float": "left"
			}
		}
	];

	var atRules = [];
	
	layouts.forEach((layout, index) => {
		if (mediaRules[index].length) {
			if (layout.media) {
				atRules.push({
					media: layout.media,
					rules: mediaRules[index]
				});
			}
			else {
				rules = rules.concat(mediaRules[index]);
			}
		}
	});

	return {
		rules,
		atRules
	};
};

function parseValue (value) {
	return value.split(splitReg).map((value) => {
		var media = "";
		var widthMatch = value.match(widthReg);
		if (widthMatch) {
			media = value.slice(0, -widthMatch[0].length);
			value = value.slice(-widthMatch[0].length);
		}
		value = value.split(rowReg);
		var width = value.length > 1 ? parseInt(value[0]) : 12;
		var blocks = value[value.length - 1].split(blockReg).map((n) => parseInt(n, 10));
		return {
			media,
			width,
			blocks
		};
	});
}

function calculateWidths (layouts) {
	return layouts.map(
		(layout, index) => layout.blocks.map(
			(block) => block / layout.width * 100
		)
	);
}

function getCascadingWidths (blockLayouts) {
	return blockLayouts.map(
		(widths, index) => widths.map(
			(width, i) => (width === getCascadingWidth(i, index, blockLayouts)) ? 0 : width
		)
	)
}

function getCascadingWidth (blockIndex, index, blockLayouts) {
	var layout;
	while (index > 0) {
		if (index === 0) {
			return index;
		}
		
		layout = blockLayouts[index - 1];
		if (blockIndex < layout.length) {
			if (layout[blockIndex] !== 0) {
				return layout[blockIndex];
			}
		}
		else {
			var prevLast = layout[layout.length - 1];
			if (prevLast !== 0) {
				return prevLast;
			}
		}
		index--;
	}
	return null;
}

function groupWidths (blockLayouts) {	
	return blockLayouts.reduce(
		(groups, widths, index) => {
			groups[index] = widths.reduce(
				(group, width, i) => {
					if (width > 0) {
						if (!(width in group)) {
							group[width] = [];
						}
						group[width].push(i);
					}
					return group;
				},
				{}
			);
			return groups;
		},
		[]
	);
	
}