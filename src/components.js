import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import './styles/global.css';
export function DoubleList({ allList, loading, onRowClick = () => {} }) {
	const [leftWidth, setLeftWidth] = useState(0);
	const Row = ({ index, style }) => {
		const item = allList[index];
		return (
			<div style={style} className='row-container row-item' value={item.code} onClick={() => onRowClick(item.code)}>
				<div className='name-code-container'>
					<div style={{ fontSize: '14px' }}>{item.股票名称}</div>
					<div style={{ fontSize: '10px' }}>{item.code}</div>
				</div>
				<div className='scrollable-col'>
					<div className='inner' style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'white') : 'green' }}>
						{Number.isFinite(item.最新价) ? item.最新价 : '停牌'}
					</div>
					<div className='inner' style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'white') : 'green' }}>
						{item.涨跌幅}
					</div>
					<div className='inner'>{item.总手 + '万'}</div>
					<div className='inner'>{item.换手率 + '%'}</div>
					<div className='inner'>{item.总市值 + '亿'}</div>
				</div>
			</div>
		);
	};
	return (
		<>
			<div className='row-container'>
				<div className='name-code-container'>名称/代码</div>
				<div className='scrollable-col'>
					<div className='inner'>价格 </div>
					<div className='inner'>涨跌幅 </div>
					<div className='inner'>成交量 </div>
					<div className='inner'>换手率 </div>
					<div className='inner'>成交额 </div>
				</div>
			</div>
			<AutoSizer>
				{({ height, width }) => {
					if (loading) return <div>加载中…</div>;
					return (
						<List height={height} itemCount={allList.length} itemSize={32} width={width}>
							{Row}
						</List>
					);
				}}
			</AutoSizer>
		</>
	);
}

export function DoubleList2({ allList, loading }) {
	const [scrollLeft, setScrollLeft] = useState(0);
	const Row = ({ index, style, data }) => {
		const scrollContainerRef = useRef(null);
		const { sharedScrollLeft, setSharedScrollLeft, activeIndex, setActiveIndex } = data;

		const handleScroll = (e) => {
			const newScrollLeft = e.currentTarget.scrollLeft;
			if (newScrollLeft !== sharedScrollLeft) {
				setSharedScrollLeft(newScrollLeft);
				setActiveIndex(index); // 告诉全局：是“我”在滚
			}
		};

		useEffect(() => {
			const el = scrollContainerRef.current;
			console.log(index);
			if (!el || index === activeIndex) return; // 如果是自己，就别同步
			el.scrollLeft = sharedScrollLeft;
		}, [sharedScrollLeft, activeIndex, index]);

		const item = allList[index];
		return (
			<div style={style} className='row-container row-item'>
				<div className='name-code-container'>
					<div style={{ fontSize: '14px' }}>{item.股票名称}</div>
					<div style={{ fontSize: '10px' }}>{item.code}</div>
				</div>
				<div className='scrollable-col' ref={scrollContainerRef} onScroll={handleScroll}>
					<div className='inner' style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'white') : 'green' }}>
						{Number.isFinite(item.最新价) ? item.最新价 : '停牌'}
					</div>
					<div className='inner' style={{ color: item.涨跌幅 >= 0 ? (item.涨跌幅 > 0 ? 'red' : 'white') : 'green' }}>
						{item.涨跌幅}
					</div>
					<div className='inner'>{item.总手 + '万'}</div>
					<div className='inner'>{item.换手率 + '%'}</div>
					<div className='inner'>{item.总市值 + '亿'}</div>
				</div>
			</div>
		);
	};
	const [sharedScrollLeft, setSharedScrollLeft] = useState(0);
	const [activeIndex, setActiveIndex] = useState(-1);

	// 通过 itemData 传递共享状态
	const itemData = {
		sharedScrollLeft,
		setSharedScrollLeft,
		activeIndex,
		setActiveIndex, // 补上这一行
	};
	return (
		<>
			<div className='row-container'>
				<div className='name-code-container'>名称/代码</div>
				<div className='scrollable-col'>
					<div className='inner'>价格 </div>
					<div className='inner'>涨跌幅 </div>
					<div className='inner'>成交量 </div>
					<div className='inner'>换手率 </div>
					<div className='inner'>成交额 </div>
				</div>
			</div>
			<AutoSizer>
				{({ height, width }) => {
					if (loading) return <div>加载中…</div>;
					return (
						<List height={height} itemCount={allList.length} itemSize={32} width={width} itemData={itemData}>
							{Row}
						</List>
					);
				}}
			</AutoSizer>
		</>
	);
}
