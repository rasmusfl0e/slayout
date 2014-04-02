module.exports = function (layouts) {

	// calculate percentage widths
	var blockLayouts = layouts.map(function (layout, index) {
		var width = layout.width;
		return layout.blocks.map(function (block) {
			return block / layout.width;
		});
	});

	// get cascading widths
	blockLayouts = blockLayouts.map(function (widths, index) {
		return widths.map(function (width, i) {
			var inherited = getCascadingBlockWidth(i, index, blockLayouts);
			return (width == inherited) ? 0 : width;
		});
	});

	// group widths

	var blockGroups = [];

	blockLayouts.forEach(function (widths, index) {
		var blockLayout;
		if (!(index in blockGroups)) {
			blockGroups[index] = {};
		}
		blockLayout = blockGroups[index];
		widths.forEach(function (width, i) {
			if (width > 0) {
				if (!(width in blockLayout)) {
					blockLayout[width] = [];
				}
				blockLayout[width].push(i);
			}
		});
	});

	console.log("blockGroups", blockGroups);

	var blockCSS = blockGroups.map(function (widths, i) {
		return Object.keys(widths).map(function (width) {
			return [
				widths[width].map(function (index) {
					return "& > :nth-child(" + ((index == blockLayouts[i].length - 1) ? "n+" : "") + (index + 1) + ")";
				}).join(","),
				parseFloat(width)
			];
		});
	});


	console.log("blockCSS", blockCSS);

	var result = layouts.map(function (layout, index) {
		var blockLayout = blockLayouts[index];
		return {
			query: layout.query,
			blocks: blockCSS
		};
	});

	console.log("result", JSON.stringify(result));

	return result;
};

function getCascadingBlockWidth (blockIndex, index, blockLayouts) {
	var layout;
	while (index > 0) {
		if (index == 0) {
			return 0;
		}
		
		layout = blockLayouts[index - 1];
		if (blockIndex < layout.length) {
			if (layout[blockIndex] != 0) {
				return layout[blockIndex];
			}
		}
		else {
			var prevLast = layout[layout.length - 1];
			if (prevLast != 0) {
				return prevLast;
			}
		}
		index--;
	}
	return null;
}