import { forwardRef, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import './App.css';
import './styles/global.css';

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
	const Header = ({ selectMode, toggleSelectAll, style }) => {
		return (
			<div
				style={{
					...style,

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
							minWidth: 24,
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: 24,
							userSelect: 'none',
							fontWeight: 'bold',
							position: 'sticky',
							right: 0,
							backgroundColor: 'white',
							display: 'flex',
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
			<Header selectMode={selectMode} toggleSelectAll={toggleSelectAll} selectedSet={selectedSet} stockList={stockList} style={style} />

			<div style={{ ...style }}>{children}</div>
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
					top: style.top + 24,
				}}
			>
				<div style={{ width: '20%', minWidth: '80px', position: 'sticky', left: 0 }} onClick={() => onRowClick(item)}>
					<div style={{ fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.股票名称}</div>
					<div style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.股票代码}</div>
				</div>
				<div style={{ display: 'flex' }} onClick={() => onRowClick(item)}>
					<div style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'black') : 'green', minWidth: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{Number.isFinite(Number(item.市盈率)) ? (item.最新价 ? item.最新价 : '停牌') : '退市'}</div>
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
							minWidth: 24,
							height: '100%',
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
			<div className='list' style={{ width: '100%', height: 90, flex: '1' }}>
				<AutoSizer>
					{({ height, width }) => {
						if (loading) return <div>加载中…</div>;
						return (
							<List height={height} itemCount={stockList.length} itemSize={32} width={width} innerElementType={InnerElementType} >	
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
