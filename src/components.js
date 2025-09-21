import { createContext, forwardRef, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid, FixedSizeList as List } from 'react-window';
import './App.css';
import './styles/global.css';

import './styles.css';
export function DoubleList({ stockList, loading, onRowClick = () => {}, selectMode, onAdd }) {
	const [leftWidth, setLeftWidth] = useState(0);
	const [selectedSet, setSelectedSet] = useState(() => new Set());

	const toggleSelect = (item) => {
		setSelectedSet((prev) => {
			const next = new Set(prev);
			if (next.has(item.股票代码)) {
				next.delete(item.股票代码);
			} else {
				next.add(item.股票代码);
			}
			return next;
		});
	};
	useEffect(() => {
		setSelectedSet(new Set());
	}, [stockList]);
	useEffect(() => {
		if (!selectMode) {
			setSelectedSet(() => new Set());
		}
	}, [selectMode]);

	const Row = ({ index, style }) => {
		const item = stockList[index];
		const selected = selectedSet.has(item.股票代码);

		return (
			<div style={style} className='row-container row-item-hover' value={item.股票代码}>
				<div className='name-code-container' onClick={() => onRowClick(item.股票代码)}>
					<div style={{ fontSize: '14px' }}>{item.股票名称}</div>
					<div style={{ fontSize: '10px' }}>{item.股票代码}</div>
				</div>
				<div className='scrollable-col' onClick={() => onRowClick(item.股票代码)}>
					<div className='inner' style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'black') : 'green' }}>
						{Number.isFinite(item.市盈率) ? (item.最新价 ? item.最新价 : '停牌') : '退市'}
					</div>
					<div className='inner' style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'black') : 'green' }}>
						{item.涨跌幅 ? item.涨跌幅 : '-'}
					</div>
					<div className='inner'>{item.总手 ? item.总手 + '万' : '-'}</div>
					<div className='inner'>{item.换手率 + '%'}</div>
					<div className='inner'>{item.总市值 ? item.总市值 + '亿' : '-'}</div>
				</div>

				{selectMode ? (
					<div
						style={{
							flex: 'none',
							width: 24,
							height: '100%',
							display: 'flex', // 新增
							alignItems: 'center', // 新增
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: 24,
							userSelect: 'none',
							fontWeight: 'bold',
						}}
						onClick={() => toggleSelect(item)}
					>
						{!selected ? '○' : '⬤'}
					</div>
				) : null}
			</div>
		);
	};
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			{/* 头部 */}
			<div className='row-container' style={{ height: '24px', flex: 'none' }}>
				<div className='name-code-container'>名称/代码</div>
				<div className='scrollable-col'>
					<div className='inner'>价格 </div>
					<div className='inner'>涨跌幅 </div>
					<div className='inner'>成交量 </div>
					<div className='inner'>换手率 </div>
					<div className='inner'>总市值 </div>
				</div>
				{selectMode ? (
					<div
						style={{ flex: 'none', width: 24, fontSize: 24, cursor: 'pointer' }}
						onClick={() => {
							setSelectedSet((prev) => {
								const newSet = new Set();
								if (prev.size === stockList.length) return newSet;
								stockList.forEach((item) => newSet.add(item.股票代码));
								return newSet;
							});
						}}
					>
						<svg stroke='currentColor' viewBox='0 0 512 512'>
							<path strokeWidth='32' d='M256 112v288m144-144H112'></path>
						</svg>
					</div>
				) : null}
			</div>

			{/* 列表区域 - 自动填充剩余空间 */}
			<AutoSizer style={{ flex: 1 }}>
				{({ height, width }) => {
					if (loading) return <div>加载中…</div>;
					return (
						<List height={selectMode ? height - 48 : height - 24} itemCount={stockList.length} itemSize={32} width={width}>
							{Row}
						</List>
					);
				}}
			</AutoSizer>

			{/* 底部按钮行 - 固定在底部 */}
			{selectMode && (
				<div
					className='row-container'
					style={{
						flex: 'none',
						height: 24,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div className='fp-btn' onClick={() => setSelectedSet(new Set())}>
						取消
					</div>
					<div className='fp-btn' onClick={() => onAdd(Array.from(selectedSet))}>
						添加
					</div>
				</div>
			)}
		</div>
	);
}

export function DoubleList1({ stockList, loading, onRowClick = () => {}, selectMode, onAdd }) {
	const [selectedSet, setSelectedSet] = useState(() => new Set());
	const [listLeft, setListLeft] = useState(0);
	useEffect(() => {
		console.log(listLeft);
	}, [listLeft]);

	const toggleSelect = (item) => {
		setSelectedSet((prev) => {
			const next = new Set(prev);
			if (next.has(item.股票代码)) {
				next.delete(item.股票代码);
			} else {
				next.add(item.股票代码);
			}
			return next;
		});
	};
	const toggleSelectAll = () => {
		setSelectedSet((prev) => {
			const newSet = new Set();
			if (prev.size === stockList.length) return newSet;
			stockList.forEach((item) => newSet.add(item.股票代码));
			return newSet;
		});
	};
	useEffect(() => {
		setSelectedSet(new Set());
	}, [stockList]);
	useEffect(() => {
		if (!selectMode) {
			setSelectedSet(() => new Set());
		}
	}, [selectMode]);

	const Row = ({ index, style }) => {
		const item = stockList[index];
		const selected = selectedSet.has(item.股票代码);
		return (
			<div
				className='list-row'
				style={{
					...style,
					display: 'flex',
					onScroll: ({ scrollLeft }) => {
						setListLeft(scrollLeft);
						console.log(scrollLeft);
					},
				}}
			>
				<div style={{ width: '20%', minWidth: '80px', position: 'sticky', left: 0 }} onClick={() => onRowClick(item.股票代码)}>
					<div style={{ fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.股票名称}</div>
					<div style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.股票代码}</div>
				</div>
				<div style={{ display: 'flex' }} onClick={() => onRowClick(item.股票代码)}>
					<div style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'black') : 'green', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{Number.isFinite(item.市盈率) ? (item.最新价 ? item.最新价 : '停牌') : '退市'}</div>
					<div style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'black') : 'green', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.涨跌幅 ? item.涨跌幅 : '-'}</div>
					<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>{item.总手 ? item.总手 + '万' : '-'}</div>
					<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>{item.换手率 + '%'}</div>
					<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>{item.总市值 ? (item.总市值 > 1000 ? Number(item.总市值).toFixed(0) + '亿' : item.总市值 + '亿') : '-'}</div>
				</div>
				{selectMode ? (
					<div
						style={{
							flex: 'none',
							width: 24,
							minWidth: '24px',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: 24,
							userSelect: 'none',
							fontWeight: 'bold',
							position: 'sticky',
							right: 0,
						}}
						onClick={() => toggleSelect(item)}
					>
						{!selected ? '○' : '⬤'}
					</div>
				) : null}
			</div>
		);
	};
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<div
				className='row-container'
				style={{
					// ...style,
					// height: 24,
					// flex: 'none',
					fontWeight: 'bold',
					position: 'sticky',
					top: 0,
				}}
			>
				<div style={{ width: '20%', minWidth: '80px', position: 'sticky', left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>名称/代码</div>
				<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>价格</div>
				<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>涨跌幅</div>
				<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>成交量</div>
				<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>换手率</div>
				<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>总市值</div>

				{selectMode ? (
					<div
						style={{
							flex: 'none',
							width: 24,
							minWidth: '24px',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: 24,
							userSelect: 'none',
							fontWeight: 'bold',
							position: 'sticky',
							right: 0,
						}}
						onClick={toggleSelectAll}
					>
						<svg stroke='currentColor' viewBox='0 0 512 512'>
							<path strokeWidth='32' d='M256 112v288m144-144H112'></path>
						</svg>
					</div>
				) : null}
			</div>
			<div style={{ width: '100%', height: '100%' }}>
				<AutoSizer>
					{({ height, width }) => {
						if (loading) return <div>加载中…</div>;
						return (
							<List className='li' height={height} itemCount={stockList.length} itemSize={32} width={width}>
								{Row}
							</List>
						);
					}}
				</AutoSizer>
			</div>
			{/* 底部按钮行 - 固定在底部 */}
			{selectMode && (
				<div
					className='row-container'
					style={{
						flex: 'none',
						height: 24,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div className='fp-btn' onClick={() => setSelectedSet(new Set())}>
						取消
					</div>
					<div className='fp-btn' onClick={() => onAdd(Array.from(selectedSet))}>
						添加
					</div>
				</div>
			)}
		</div>
	);
}
export function StockList({ stockList, loading, onRowClick = () => {}, selectMode, onAdd }) {
	const [selectedSet, setSelectedSet] = useState(() => new Set());

	const toggleSelect = (item) => {
		setSelectedSet((prev) => {
			const next = new Set(prev);
			if (next.has(item.股票代码)) {
				next.delete(item.股票代码);
			} else {
				next.add(item.股票代码);
			}
			return next;
		});
	};
	const toggleSelectAll = () => {
		setSelectedSet((prev) => {
			const newSet = new Set();
			if (prev.size === stockList.length) return newSet;
			stockList.forEach((item) => newSet.add(item.股票代码));
			return newSet;
		});
	};
	useEffect(() => {
		setSelectedSet(new Set());
	}, [stockList]);
	useEffect(() => {
		if (!selectMode) {
			setSelectedSet(() => new Set());
		}
	}, [selectMode]);
	const Header = ({ selectMode, toggleSelectAll }) => {
		return (
			<div
				style={{
					display: 'flex',
					fontWeight: 'bold',
					position: 'sticky',
					top: 0,
					height: '24px',
					zIndex: 100,
				}}
			>
				<div style={{ backgroundColor: 'white', width: '20%', minWidth: '80px', position: 'sticky', left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>名称/代码</div>
				<div style={{ backgroundColor: 'white', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>价格</div>
				<div style={{ backgroundColor: 'white', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>涨跌幅</div>
				<div style={{ backgroundColor: 'white', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>成交量</div>
				<div style={{ backgroundColor: 'white', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>换手率</div>
				<div style={{ backgroundColor: 'white', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>总市值</div>
				{selectMode ? (
					<div
						style={{
							flex: 'none',
							width: 24,
							minWidth: '24px',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: 24,
							userSelect: 'none',
							fontWeight: 'bold',
							position: 'sticky',
							right: 0,
							backgroundColor: 'white',
						}}
						onClick={toggleSelectAll}
					>
						<svg stroke='currentColor' viewBox='0 0 512 512'>
							<path strokeWidth='32' d='M256 112v288m144-144H112'></path>
						</svg>
					</div>
				) : null}
			</div>
		);
	};
	const InnerElementType = forwardRef(({ children, style, ...rest }, ref) => (
		<div ref={ref} {...rest}>
			<Header selectMode={selectMode} toggleSelectAll={toggleSelectAll} selectedSet={selectedSet} stockList={stockList} />
			<div style={{ ...style, position: 'relative' }}>{children}</div>
		</div>
	));
	const Row = ({ index, style }) => {
		const item = stockList[index];
		const selected = selectedSet.has(item.股票代码);
		return (
			<div
				style={{
					...style,
					display: 'flex',
				}}
			>
				<div style={{ width: '20%', minWidth: '80px', position: 'sticky', left: 0 }} onClick={() => onRowClick(item.股票代码)}>
					<div style={{ fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.股票名称}</div>
					<div style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.股票代码}</div>
				</div>
				<div style={{ display: 'flex' }} onClick={() => onRowClick(item.股票代码)}>
					<div style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'black') : 'green', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{Number.isFinite(item.市盈率) ? (item.最新价 ? item.最新价 : '停牌') : '退市'}</div>
					<div style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'black') : 'green', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.涨跌幅 ? item.涨跌幅 : '-'}</div>
					<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>{item.总手 ? item.总手 + '万' : '-'}</div>
					<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>{item.换手率 + '%'}</div>
					<div style={{ minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>{item.总市值 ? (item.总市值 > 1000 ? Number(item.总市值).toFixed(0) + '亿' : item.总市值 + '亿') : '-'}</div>
				</div>
				{selectMode ? (
					<div
						style={{
							flex: 'none',
							width: 24,
							minWidth: '24px',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: 24,
							userSelect: 'none',
							fontWeight: 'bold',
							position: 'sticky',
							right: 0,
							backgroundColor: 'white',
						}}
						onClick={() => toggleSelect(item)}
					>
						{!selected ? '○' : '⬤'}
					</div>
				) : null}
			</div>
		);
	};
	return (
		<>
			<div className='list' style={{ width: '100%', height: '100%', flex: '1' }}>
				<AutoSizer>
					{({ height, width }) => {
						if (loading) return <div>加载中…</div>;
						return (
							<List height={height} itemCount={stockList.length} itemSize={32} width={width} innerElementType={InnerElementType}>
								{Row}
							</List>
						);
					}}
				</AutoSizer>
			</div>
			{/* 底部按钮行 - 固定在底部 */}
			{selectMode && (
				<div
					className='row-container'
					style={{
						flex: 'none',
						height: 24,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div className='fp-btn' onClick={() => setSelectedSet(new Set())}>
						取消
					</div>
					<div className='fp-btn' onClick={() => onAdd(Array.from(selectedSet))}>
						添加
					</div>
				</div>
			)}
		</>
	);
}
export function DoubleList3() {
	const Row = ({ index, style }) => (
		<div style={style}>
			<div
				style={{
					display: 'flex',
					minWidth: 'max-content',
				}}
			>
				{/* 固定列 */}
				<div
					style={{
						padding: '10px',
						minWidth: '50px',
						position: 'sticky',
						left: 0,
						background: 'white',
						zIndex: 1,
						borderRight: '1px solid #eee',
					}}
				>
					<div>王五</div>
					<div>{index + 1}</div>
				</div>
				{/* 数据列 */}
				{[...Array(16)].map((_, i) => (
					<div key={i} style={{ padding: '10px' }}>
						116
					</div>
				))}
			</div>
		</div>
	);

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<AutoSizer>
				{({ height, width }) => (
					<List height={height} itemCount={20} itemSize={80} width={width}>
						{Row}
					</List>
				)}
			</AutoSizer>
		</div>
	);
}

export function DoubleList4({ loading }) {
	const getRenderedCursor = (children) =>
		children.reduce(
			([minRow, maxRow, minColumn, maxColumn], { props: { columnIndex, rowIndex } }) => {
				if (rowIndex < minRow) {
					minRow = rowIndex;
				}
				if (rowIndex > maxRow) {
					maxRow = rowIndex;
				}
				if (columnIndex < minColumn) {
					minColumn = columnIndex;
				}
				if (columnIndex > maxColumn) {
					maxColumn = columnIndex;
				}

				return [minRow, maxRow, minColumn, maxColumn];
			},
			[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
		);

	const headerBuilder = (minColumn, maxColumn, columnWidth, stickyHeight) => {
		const columns = [];

		for (let i = minColumn; i <= maxColumn; i++) {
			columns.push({
				height: stickyHeight,
				width: columnWidth,
				left: i * columnWidth,
				label: `Sticky Col ${i}`,
			});
		}

		return columns;
	};

	const columnsBuilder = (minRow, maxRow, rowHeight, stickyWidth) => {
		const rows = [];

		for (let i = minRow; i <= maxRow; i++) {
			rows.push({
				height: rowHeight,
				width: stickyWidth,
				top: i * rowHeight,
				label: `Sticky Row ${i}`,
			});
		}

		return rows;
	};

	const GridColumn = ({ rowIndex, columnIndex, style }) => {
		return (
			<div className='sticky-grid__data__column' style={style}>
				Cell {rowIndex}, {columnIndex}
			</div>
		);
	};

	const StickyHeader = ({ stickyHeight, stickyWidth, headerColumns }) => {
		const baseStyle = {
			height: stickyHeight,
			width: stickyWidth,
		};
		const scrollableStyle = { left: stickyWidth };

		return (
			<div className='sticky-grid__header'>
				<div className='sticky-grid__header__base' style={baseStyle}>
					Sticky Base
				</div>
				<div className='sticky-grid__header__scrollable' style={scrollableStyle}>
					{headerColumns.map(({ label, ...style }, i) => (
						<div className='sticky-grid__header__scrollable__column' style={style} key={i}>
							{label}
						</div>
					))}
				</div>
			</div>
		);
	};

	const StickyColumns = ({ rows, stickyHeight, stickyWidth }) => {
		const leftSideStyle = {
			top: stickyHeight,
			width: stickyWidth,
			height: `calc(100% - ${stickyHeight}px)`,
		};

		return (
			<div className='sticky-grid__sticky-columns__container' style={leftSideStyle}>
				{rows.map(({ label, ...style }, i) => (
					<div className='sticky-grid__sticky-columns__row' style={style} key={i}>
						{label}
					</div>
				))}
			</div>
		);
	};

	const StickyGridContext = createContext();
	StickyGridContext.displayName = 'StickyGridContext';

	const innerGridElementType = forwardRef(({ children, ...rest }, ref) => (
		<StickyGridContext.Consumer>
			{({ stickyHeight, stickyWidth, headerBuilder, columnsBuilder, columnWidth, rowHeight }) => {
				const [minRow, maxRow, minColumn, maxColumn] = getRenderedCursor(children); // TODO maybe there is more elegant way to get this
				const headerColumns = headerBuilder(minColumn, maxColumn, columnWidth, stickyHeight);
				const leftSideRows = columnsBuilder(minRow, maxRow, rowHeight, stickyWidth);
				const containerStyle = {
					...rest.style,
					width: `${parseFloat(rest.style.width) + stickyWidth}px`,
					height: `${parseFloat(rest.style.height) + stickyHeight}px`,
				};
				const containerProps = { ...rest, style: containerStyle };
				const gridDataContainerStyle = { top: stickyHeight, left: stickyWidth };

				return (
					<div className='sticky-grid__container' ref={ref} {...containerProps}>
						<StickyHeader headerColumns={headerColumns} stickyHeight={stickyHeight} stickyWidth={stickyWidth} />
						<StickyColumns rows={leftSideRows} stickyHeight={stickyHeight} stickyWidth={stickyWidth} />

						<div className='sticky-grid__data__container' style={gridDataContainerStyle}>
							{children}
						</div>
					</div>
				);
			}}
		</StickyGridContext.Consumer>
	));

	const StickyGrid = ({ stickyHeight, stickyWidth, columnWidth, rowHeight, children, ...rest }) => (
		<StickyGridContext.Provider
			value={{
				stickyHeight,
				stickyWidth,
				columnWidth,
				rowHeight,
				headerBuilder,
				columnsBuilder,
			}}
		>
			<Grid columnWidth={columnWidth} rowHeight={rowHeight} innerElementType={innerGridElementType} {...rest}>
				{children}
			</Grid>
		</StickyGridContext.Provider>
	);

	return (
		<AutoSizer>
			{({ height, width }) => {
				if (loading) return <div>加载中…</div>;
				return (
					<StickyGrid width={width} height={height} rowCount={100} columnCount={6} rowHeight={40} columnWidth={120} stickyWidth={150} stickyHeight={50}>
						{GridColumn}
					</StickyGrid>
				);
			}}
		</AutoSizer>
	);
}

export function TestList({ loading }) {
	// 计算当前渲染区域的行列范围
	const getRenderedCursor = (children) =>
		children.reduce(
			([minRow, maxRow, minColumn, maxColumn], { props: { columnIndex, rowIndex } }) => {
				if (rowIndex < minRow) minRow = rowIndex;
				if (rowIndex > maxRow) maxRow = rowIndex;
				if (columnIndex < minColumn) minColumn = columnIndex;
				if (columnIndex > maxColumn) maxColumn = columnIndex;
				return [minRow, maxRow, minColumn, maxColumn];
			},
			[Infinity, -Infinity, Infinity, -Infinity]
		);

	// 构建表头（顶部固定行）
	const buildHeaderColumns = (minCol, maxCol, colWidth, stickyHeight) =>
		Array.from({ length: maxCol - minCol + 1 }, (_, i) => {
			const colIndex = minCol + i;
			return {
				height: stickyHeight,
				width: colWidth,
				left: colIndex * colWidth,
				label: `Sticky Col ${colIndex}`,
			};
		});

	// 构建左侧固定列
	const buildStickyRows = (minRow, maxRow, rowHeight, stickyWidth) =>
		Array.from({ length: maxRow - minRow + 1 }, (_, i) => {
			const rowIndex = minRow + i;
			return {
				height: rowHeight,
				width: stickyWidth,
				top: rowIndex * rowHeight,
				label: `Sticky Row ${rowIndex}`,
			};
		});

	// 单元格组件
	const GridCell = ({ rowIndex, columnIndex, style }) => (
		<div className='sticky-grid__data__column' style={style}>
			Cell {rowIndex}, {columnIndex}
		</div>
	);

	// 固定表头组件
	const StickyHeader = ({ headerColumns, stickyHeight, stickyWidth }) => (
		<div className='sticky-grid__header'>
			<div className='sticky-grid__header__base' style={{ height: stickyHeight, width: stickyWidth }}>
				Sticky Base
			</div>
			<div className='sticky-grid__header__scrollable' style={{ left: stickyWidth }}>
				{headerColumns.map((col, i) => (
					<div className='sticky-grid__header__scrollable__column' style={col} key={i}>
						{col.label}
					</div>
				))}
			</div>
		</div>
	);

	// 左侧固定列组件
	const StickyColumns = ({ rows, stickyHeight, stickyWidth }) => (
		<div
			className='sticky-grid__sticky-columns__container'
			style={{
				top: stickyHeight,
				width: stickyWidth,
				height: `calc(100% - ${stickyHeight}px)`,
			}}
		>
			{rows.map((row, i) => (
				<div className='sticky-grid__sticky-columns__row' style={row} key={i}>
					{row.label}
				</div>
			))}
		</div>
	);

	// 自定义 innerElementType：包裹内容 + 插入固定头和列
	const InnerElementType = forwardRef(({ children, style, ...rest }, ref) => {
		const stickyHeight = 50; // 可提取为 prop，当前硬编码简化
		const stickyWidth = 100;
		const columnWidth = 120;
		const rowHeight = 40;

		const [minRow, maxRow, minColumn, maxColumn] = getRenderedCursor(children);
		const headerColumns = buildHeaderColumns(minColumn, maxColumn, columnWidth, stickyHeight);
		const stickyRows = buildStickyRows(minRow, maxRow, rowHeight, stickyWidth);

		const containerStyle = {
			...style,
			width: `${parseFloat(style.width) + stickyWidth}px`,
			height: `${parseFloat(style.height) + stickyHeight}px`,
		};

		return (
			<div className='sticky-grid__container' ref={ref} style={containerStyle} {...rest}>
				<StickyHeader headerColumns={headerColumns} stickyHeight={stickyHeight} stickyWidth={stickyWidth} />
				<StickyColumns rows={stickyRows} stickyHeight={stickyHeight} stickyWidth={stickyWidth} />
				<div className='sticky-grid__data__container' style={{ top: stickyHeight, left: stickyWidth }}>
					{children}
				</div>
			</div>
		);
	});

	// 最终导出的最小 StickyGrid 组件
	const StickyGrid = ({ height, width, columnCount, rowCount, ...props }) => (
		<Grid
			height={height}
			width={width}
			columnCount={columnCount}
			rowCount={rowCount}
			columnWidth={120} // 可参数化
			rowHeight={30} // 可参数化
			innerElementType={InnerElementType}
			{...props}
		>
			{GridCell}
		</Grid>
	);

	return (
		<AutoSizer>
			{({ height, width }) => {
				if (loading) return <div>加载中…</div>;
				return (
					<StickyGrid width={width} height={height} rowCount={100} columnCount={6} rowHeight={40} columnWidth={120} stickyWidth={100} stickyHeight={50}>
						{}
					</StickyGrid>
				);
			}}
		</AutoSizer>
	);
}
