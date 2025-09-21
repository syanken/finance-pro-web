import { useEffect, useRef, useState } from 'react';
import { StockList } from '../../components';

class TVChart {
	constructor(chartdom, data = []) {
		this.chartdom = chartdom;
		this.paneCount = 2;
		this.stretchFactor = 4;
		this.chart = window.LightweightCharts.createChart(this.chartdom, {
			width: 0,
			height: 0,
			rightPriceScale: { visible: false },
			leftPriceScale: {
				visible: true,
				scaleMargins: {
					top: 0,
					bottom: 0,
				},
				entireTextOnly: true,
				// ensureEdgeTickMarksVisible: true,
			},
			timeScale: {
				visible: true,
				// tickMarkFormatter: (time) => {
				// 	const date = new Date(time * 1000);
				// 	return date.toISOString().replace('T', ' ').substring(0, 19);
				// },
			},
			grid: { vertLines: { visible: true } },
			layout: {
				textColor: 'black',
				background: { type: 'solid', color: 'white' },
				panes: {
					separatorColor: '#626262ff',
					separatorHoverColor: 'rgba(255, 0, 0, 0.1)',
					enableResize: false,
				},
				attributionLogo: false,
			},
			localization: {
				timeFormatter: formatTime,
			},
		});
		window.addEventListener('resize', () => this.syncResize());
		this.style = { color: '#2196F3', lineWidth: 1 };
		this.data = data;
		for (let i = 0; i < this.paneCount; i++) {
			this.chart.addSeries(this.type['Bar'], this.style, i).setData([]);
			this.chart.panes()[i].setPreserveEmptyPane(true);
		}
		this.chart.panes()[0].setStretchFactor(this.stretchFactor);

		function myClickHandler(param) {
			if (!param.point) {
				return;
			}

			// let  date = new Date(param.time * 1000);
			// date = date.toISOString().replace('T', ' ').substring(0, 19);

			// console.log(date);
		}

		this.chart.subscribeClick(myClickHandler);

		//tooltip
		const toolTipWidth = 80;
		const toolTipHeight = 80;
		const toolTipMargin = 15;

		// Create and style the tooltip html element
		const toolTip = document.createElement('div');
		toolTip.style = `width: 96px; height: 80px; position: absolute; display: none;  box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
		toolTip.style.background = 'white';
		toolTip.style.color = 'black';
		toolTip.style.borderColor = '#000000ff';
		this.chartdom.appendChild(toolTip);

		// update tooltip
		this.chart.subscribeCrosshairMove((param) => {
			if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > this.chartdom.clientWidth || param.point.y < 0 || param.point.y > this.chartdom.clientHeight) {
				toolTip.style.display = 'none';
				return;
			}

			// 取第一条序列（K 线）
			const candleSeries = this.chart.panes()[0]?.getSeries()[0];
			if (!candleSeries) return;

			// const dataPoint = param.seriesData.get(candleSeries);
			const [seriesKey, dataPoint] = [...param.seriesData.entries()][0];
			if (!dataPoint) {
				toolTip.style.display = 'none';
				return;
			}

			const price = dataPoint.value !== undefined ? dataPoint.value : dataPoint.close;

			toolTip.style.display = 'block';
			toolTip.innerHTML = `
				<div style="font-size:12px;color:#000">
				<div>O: ${(dataPoint.open ?? 0).toFixed(2)}</div>
				<div>H: ${(dataPoint.high ?? 0).toFixed(2)}</div>
				<div>L: ${(dataPoint.low ?? 0).toFixed(2)}</div>
				<div>C: ${(dataPoint.close ?? 0).toFixed(2)}</div>
				<div style="margin-top:4px">${formatTime(dataPoint.time)}</div>
				</div>
			`;

			const coordinate = candleSeries.priceToCoordinate(price);
			if (coordinate === null) return;

			const toolTipWidth = 96;
			const toolTipHeight = 80;
			const toolTipMargin = 10;

			let left = param.point.x - toolTipWidth / 2;
			left = Math.max(0, Math.min(this.chartdom.clientWidth - toolTipWidth, left));

			let top = coordinate - toolTipHeight - toolTipMargin > 0 ? coordinate - toolTipHeight - toolTipMargin : coordinate + toolTipMargin;
			top = Math.max(0, Math.min(this.chartdom.clientHeight - toolTipHeight, top));

			toolTip.style.left = left + 'px';
			toolTip.style.top = top + 'px';
		});
		this._onResize = () => this.syncResize();
		window.addEventListener('resize', this._onResize);
	}
	setData(data) {
		this.chart.panes().forEach((pane, i) => {
			pane.getSeries().forEach((series, j) => {
				this.chart.removeSeries(series);
			});
			if (i < data.length) {
				data[i].forEach((series, j) => {
					this.chart.addSeries(this.type[data[i][j].type], this.styles[data[i][j].type], i).setData(data[i][j].data);
				});
			}
		});
	}
	syncResize() {
		if (!this.chart) return;

		this.chart.applyOptions({ width: this.chartdom.clientWidth, height: this.chartdom.clientHeight });
		this.chart.timeScale().fitContent();
	}
	type = {
		Area: window.LightweightCharts.AreaSeries,
		Bar: window.LightweightCharts.BarSeries,
		Candlestick: window.LightweightCharts.CandlestickSeries,
		Baseline: window.LightweightCharts.BaselineSeries,
		Histogram: window.LightweightCharts.HistogramSeries,
		Line: window.LightweightCharts.LineSeries,
	};
	styles = {
		Candlestick: {
			upColor: '#ef5350',
			downColor: '#26a69a',
			borderVisible: false,
			wickUpColor: '#ef5350',
			wickDownColor: '#26a69a',
		},
		Histogram: {
			color: '#26a69a',
			priceFormat: {
				type: 'custom',
				formatter: (t) => (t >= 100000 ? (t / 10000).toFixed(2) + '万' : t.toFixed(0)),
			},
			priceScaleId: 'left',
			invertScale: false,
		},
	};
	destroy() {
		if (this.chart) {
			this.chart.remove();
			this.chart = null;
		}
		if (this._onResize) {
			window.removeEventListener('resize', this._onResize);
			this._onResize = null;
		}
	}
}
function formatTime(timestamp) {
	const date = new Date(timestamp * 1000);
	const h = date.getUTCHours();
	const m = date.getUTCMinutes();
	const s = date.getUTCSeconds();
	const ms = date.getUTCMilliseconds();

	if (h === 0 && m === 0 && s === 0 && ms === 0) {
		return date.getUTCFullYear() + '-' + String(date.getUTCMonth() + 1).padStart(2, '0') + '-' + String(date.getUTCDate()).padStart(2, '0');
	} else {
		return date.getUTCFullYear() + '-' + String(date.getUTCMonth() + 1).padStart(2, '0') + '-' + String(date.getUTCDate()).padStart(2, '0') + ' ' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
	}
}
function useDraggable(dragSelector = null, initialPos = { x: 200, y: 200 }) {
	const [position, setPosition] = useState(initialPos);
	const [isDragging, setIsDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const ref = useRef(null);

	const handleDown = (e) => {
		if (dragSelector && !e.target.closest(dragSelector)) return;
		setIsDragging(true);
		const rect = ref.current.getBoundingClientRect();
		setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
	};

	const handleMove = (e) => {
		if (!isDragging) return;
		const { innerWidth, innerHeight } = window;
		const { width, height } = ref.current.getBoundingClientRect();
		let x = e.clientX - offset.x;
		let y = e.clientY - offset.y;
		x = Math.max(0, Math.min(x, innerWidth - width));
		y = Math.max(0, Math.min(y, innerHeight - height));
		setPosition({ x, y });
	};

	const handleUp = () => setIsDragging(false);

	useEffect(() => {
		if (!isDragging) return;
		const prevent = (e) => e.preventDefault();
		document.addEventListener('selectstart', prevent);
		document.addEventListener('mousemove', handleMove);
		document.addEventListener('mouseup', handleUp);
		return () => {
			document.removeEventListener('selectstart', prevent);
			document.removeEventListener('mousemove', handleMove);
			document.removeEventListener('mouseup', handleUp);
		};
	}, [isDragging]);

	return { ref, position, handleDown };
}
function ChartSetting({ visible, toggleSetting }) {
	const { ref, position, handleDown } = useDraggable('.window-header');

	return (
		<div className='drag-window' ref={ref} onMouseDown={handleDown} style={{ left: position.x, top: position.y, display: visible ? 'flex' : 'none' }}>
			<div className='window-header'>
				图表设置
				<span className='close' onClick={toggleSetting}>
					&times;
				</span>
			</div>
			<div className='window-content'>
				<div className='window-content-left'>
					<div>1</div>
					<div>2</div>
					<div>3</div>
				</div>
				<div className='window-content-right'>
					<div>1</div>
					<div>2</div>
					<div>3</div>
				</div>
			</div>
		</div>
	);
}

function Filter({ visible, toggleFilter, allList, setList }) {
	const { ref, position, handleDown } = useDraggable('.window-header');
	const selects = ['最新价', '换手率', '总手', '成交额', '振幅', '市盈率', '量比', '总市值', '市净率'];
	const [rows, setRows] = useState([]);
	const addRow = () => {
		setRows([...rows, { index: Date.now(), select: '', condition: '', value: '', complete: false }]);
	};
	const handleFilter = () => {
		const rowFilterWithNoEmpty = rows.filter((r) => r.select || r.condition || r.value !== '');
		rowFilterWithNoEmpty.forEach((r) => (r.select && r.condition && r.value !== '' ? (r.complete = true) : (r.complete = false)));
		setRows(rowFilterWithNoEmpty);
		const allComplete = rowFilterWithNoEmpty.every((r) => r.complete);
		if (!allComplete || rowFilterWithNoEmpty.length === 0) {
			console.warn('还有未填完整的筛选条件');
			return;
		}
		const params = rowFilterWithNoEmpty.reduce((acc, r) => {
			const opMap = { 大于: '>', 小于: '<', 等于: '=' };
			acc[r.select] = acc[r.select] || [];
			acc[r.select].push({ condition: opMap[r.condition], value: Number(r.value) });
			return acc;
		}, {});

		const result = allList.filter((item) => {
			for (const key in params) {
				for (const { condition, value } of params[key]) {
					const v = Number(item[key]);
					if (condition === '=' && v !== value) return false;
					if (condition === '>' && v <= value) return false;
					if (condition === '<' && v >= value) return false;
				}
			}
			return true;
		});
		console.log('筛选结果:', result);
		setList(result);
	};
	return (
		<div className='drag-window' ref={ref} onMouseDown={handleDown} style={{ left: position.x, top: position.y, display: visible ? 'flex' : 'none' }}>
			<div className='window-header'>
				筛选
				<span className='close' onClick={toggleFilter}>
					&times;
				</span>
			</div>
			<div className='window-content'>
				<div className='window-table-wrapper'>
					<table className='window-table'>
						<thead>
							<tr>
								<th>指标</th>
								<th>条件</th>
								<th>值</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr key={row.index}>
									<td>
										<select value={row.select} onChange={(e) => setRows(rows.map((r) => (r.index === row.index ? { ...r, select: e.target.value } : r)))}>
											<option value='' disabled>
												请选择
											</option>
											{selects.map((select) => (
												<option key={select} value={select}>
													{select}
												</option>
											))}
										</select>
									</td>
									<td>
										<select value={row.condition} onChange={(e) => setRows(rows.map((r) => (r.index === row.index ? { ...r, condition: e.target.value } : r)))}>
											<option value='' disabled>
												请选择
											</option>
											<option value='大于'>大于</option>
											<option value='小于'>小于</option>
											<option value='等于'>等于</option>
										</select>
									</td>
									<td>
										<input type='number' value={row.value} onChange={(e) => setRows(rows.map((r) => (r.index === row.index ? { ...r, value: e.target.value } : r)))} />
									</td>
									<td>
										<div className='fp-btn' onClick={() => setRows(rows.filter((r) => r.index !== row.index))}>
											删除
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className='row-container'>
				<div className='fp-btn' onClick={addRow}>
					添加
				</div>
				<div className='fp-btn' onClick={handleFilter}>
					筛选
				</div>
				<div
					className='fp-btn '
					onClick={() => {
						setRows([]);
						setList(allList);
					}}
				>
					重置
				</div>
			</div>
		</div>
	);
}

function useFetchAllList() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/api/alllist')
			.then((res) => res.json())
			.then((res) => {
				setData(res);
			})
			.finally(() => setLoading(false));
	}, []);

	return { data, loading };
}
const convertKlineData = (data) => {
	let prevClose = 0;
	return [
		data.map((item) => {
			const color = () => {
				if (Number(item[2]) > Number(item[1]) || (Number(item[3]) === Number(item[4]) && Number(item[2]) > prevClose)) {
					return '#ef5350';
				} else if (Number(item[2]) < Number(item[1]) || (Number(item[3]) === Number(item[4]) && Number(item[2]) < prevClose)) {
					return '#26a69a';
				} else {
					return 'black';
				}
			};
			prevClose = Number(item[2]);
			return {
				time: Number(item[0]),
				open: Number(item[1]),
				high: Number(item[3]),
				low: Number(item[4]),
				close: Number(item[2]),
				color: color(),
				wickColor: color(),
			};
		}),
		data.map((item) => {
			const color = prevClose === null || item[2] >= prevClose ? '#ef5350' : '#26a69a';
			prevClose = Number(item[2]);
			return {
				time: Number(item[0]),
				value: Number(item[5]),
				color,
			};
		}),
	];
};

const getKLineData = async (code,ts='1d') => {
	const res = await fetch(`/api/kline?code=${code}&ts=${ts}`);
	const data = await res.json();
	if (data.data[0][0].includes('-')) {
			data.data.map((item) => {
			item[0] = Math.floor(new Date(item[0]).getTime() / 1000);
		});
	}
	const klineData = convertKlineData(data.data);
	return klineData;
};
function MaCalculater(candleData, maLength = 5) {
	const maData = [];
	for (let i = 0; i < candleData.length; i++) {
		if (i < maLength) {
			maData.push({ time: candleData[i].time });
		} else {
			let sum = 0;
			for (let j = 0; j < maLength; j++) {
				sum += candleData[i - j].close;
			}
			const maValue = sum / maLength;
			maData.push({ time: candleData[i].time, value: maValue });
		}
	}
	return maData;
}

function GroupSelect({ visible, watchlists, setWatchlistVisible }) {
	const { ref, position, handleDown } = useDraggable('.window-header');
	const [selectedSet, setSelectedSet] = useState(() => new Set());
	const [editingId, setEditingId] = useState(null); // 正在编辑的分组 id
	const [editValue, setEditValue] = useState(''); // 当前输入框内容
	useEffect(() => {
		if (!visible) return;
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setWatchlistVisible(!visible);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [visible]);
	const userId = 1;
	const saveName = async (id, newName) => {
		if (!newName.trim()) return;
		const res = await fetch(`/api/watchlist?userId=${userId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: id,
				name: newName.trim(),
			}),
		});
		const updated = await res.json();
		// 用后端返回的最新数据替换本地
		// setWatchlists((prev) => prev.map((g) => (g.id === id ? updated : g)));
		setEditingId(null);
	};
	return (
		<div className='drag-window' ref={ref} onMouseDown={handleDown} style={{ left: position.x, top: position.y, display: visible ? 'flex' : 'none' }}>
			<div className='window-header'>
				分组
				<span className='close' onClick={() => setWatchlistVisible(!visible)}>
					&times;
				</span>
			</div>
			<div className='window-content'>
				<div className='window-table-wrapper'>
					<table className='window-table'>
						<thead>
							<tr>
								<th>分组</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							{watchlists.map((watchlist) => (
								<tr key={watchlist.id}>
									<td>
										{editingId === watchlist.id ? (
											<input
												className='fp-btn'
												type='text'
												value={editValue}
												onChange={(e) => setEditValue(e.target.value)}
												onBlur={() => saveName(watchlist.id, editValue)}
												onKeyDown={(e) => {
													if (e.key === 'Enter') saveName(watchlist.id, editValue);
													if (e.key === 'Escape') setEditingId(null);
												}}
												autoFocus
											/>
										) : (
											<span
												style={{ cursor: 'pointer' }}
												onClick={() => {
													setEditingId(watchlist.id);
													setEditValue(watchlist.name);
												}}
											>
												{watchlist.name}
											</span>
										)}
									</td>
									<td>
										<div className='fp-btn' onClick={() => setSelectedSet((prev) => new Set(prev).add(watchlist.id))}>
											{selectedSet.has(watchlist.id) ? '○' : '⬤'}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className='row-container'>
				<div className='fp-btn' onClick={() => {}}>
					新建
				</div>
				<div className='fp-btn' onClick={() => setWatchlistVisible(!visible)}>
					确定
				</div>
			</div>
		</div>
	);
}

function Quote() {
	const { data: allList, loading } = useFetchAllList();
	const [list, setList] = useState([]);
	const [watchlists, setWatchlists] = useState([]);
	const [settingVisible, setSettingVisible] = useState(false);
	const [filterVisible, setFilterVisible] = useState(false);
	const [selectMode, setSelectMode] = useState(false);
	const [watchlistVisible, setWatchlistVisible] = useState(false);
	const [currentStockInfo, setCurrentStockInfo] = useState({});

	const chartContainerRef = useRef(null);
	const tvChartRef = useRef(null);
	const userId = 1;
	useEffect(() => {
		setList(allList);
	}, [allList]);
	useEffect(() => {
		if (!chartContainerRef.current) return;
		tvChartRef.current = new TVChart(chartContainerRef.current);
		return () => {
			if (tvChartRef.current?.chart) {
				tvChartRef.current.destroy();
				tvChartRef.current = null;
			}
		};
	}, []);
	useEffect(() => {
		fetch(`/api/watchlist?userId=${userId}`)
			.then((res) => res.json())
			.then((data) => {
				setWatchlists(data);
				// console.log(data);
			})
			.catch(console.error);
	}, []);
	const handleRowClick = async (item) => {
		let ts='1d';
		const klineData = await getKLineData(item.股票代码,ts);

		setCurrentStockInfo(item);
		const tvData = [
			[
				{
					type: 'Candlestick',
					data: klineData[0],
				},
				{
					type: 'Line',
					data: MaCalculater(klineData[0], 5),
				},
			],
			[
				{
					type: 'Histogram',
					data: klineData[1],
				},
			],
		];
		tvChartRef.current.setData(tvData);
	};

	const toggleSetting = () => {
		setSettingVisible(!settingVisible);
	};
	const toggleFilter = () => {
		setFilterVisible(!filterVisible);
	};
	const toggleWatchlist = () => {
		setSelectMode(!selectMode);
	};
	const toggleSelect = (data) => {
		console.log(data);
		setWatchlistVisible(true);
	};
	const showLabel = (k, v) => (
		<div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
			<span style={{ color: '#666', paddingLeft: 10 }}>{k}:</span>
			<span style={{ color: '#000', fontWeight: 500, paddingRight: 10 }}>{v}</span>
		</div>
	);
	return (
		<>
			<div className='kline'>
				<div className='row-container'>
					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'row',
							overflow: 'auto',
							scrollbarWidth: 'none',
						}}
					>
						<div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }}>
							<div style={{ flex: 1 }}>{currentStockInfo.股票名称}</div>
							<div style={{ flex: 1 }}>{currentStockInfo.股票代码}</div>
						</div>
						<div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }}>
							<div style={{ flex: 1, color: currentStockInfo.涨跌幅 >= 0 ? (currentStockInfo.涨跌幅 > 0 ? 'red' : 'black') : 'green' }}>{currentStockInfo.最新价}</div>
							<div style={{ flex: 1, color: currentStockInfo.涨跌幅 >= 0 ? (currentStockInfo.涨跌幅 > 0 ? 'red' : 'black') : 'green' }}>{currentStockInfo.涨跌幅}%</div>
						</div>
						<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
							{showLabel('开盘价', currentStockInfo.开盘价 ?? '-')}
							{showLabel('最高价', currentStockInfo.最高价 ?? '-')}
						</div>
						<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
							{showLabel('最低价', currentStockInfo.最低价 ?? '-')}
							{showLabel('换手率', currentStockInfo.换手率 ?? '-')}
						</div>
						<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
							{showLabel('总手', currentStockInfo.总手 ?? '-')}
							{showLabel('成交额', currentStockInfo.成交额 ?? '-')}
						</div>
						<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
							{showLabel('总市值', currentStockInfo.总市值 ?? '-')}
							{showLabel('市净率', currentStockInfo.市净率 ?? '-')}
						</div>
					</div>
					<div className='setting-button' onClick={toggleSetting}>
						<svg stroke='currentColor' fill='currentColor' strokeWidth='0' viewBox='0 0 1024 1024' fontSize='18px' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'>
							<path d='M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a443.74 443.74 0 0 0-79.7-137.9l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.4a351.86 351.86 0 0 0-99 57.4l-81.9-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a446.02 446.02 0 0 0-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0 0 25.8 25.7l2.7.5a449.4 449.4 0 0 0 159 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-85a350 350 0 0 0 99.7-57.6l81.3 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 0 1-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 0 1-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 0 1 624 502c0 29.9-11.7 58-32.8 79.2z'></path>
						</svg>
					</div>
				</div>
				<div id='tvChartContainer'>
					<div ref={chartContainerRef} id='tvChartContainer'></div>
				</div>
			</div>
			<div id='watchlist-box'>
				<div className='watchlist-title'>
					<div className='watchlist-list'>
						<div className='watchlist-list-item' onClick={() => setList(allList)}>
							全部列表
						</div>
						{watchlists.map((item) => {
							return (
								<div className='watchlist-list-item' key={item.id} onClick={() => setList(item.data)}>
									{item.name}
								</div>
							);
						})}
					</div>
					<div className='row-container'>
						<div className='fp-btn' onClick={toggleFilter}>
							筛选
						</div>
						<div className='fp-btn' onClick={toggleWatchlist}>
							自选
						</div>
					</div>
				</div>
				<StockList stockList={list} loading={loading} onRowClick={handleRowClick} selectMode={selectMode} onAdd={toggleSelect} />
			</div>
			<ChartSetting visible={settingVisible} toggleSetting={toggleSetting}></ChartSetting>
			<Filter visible={filterVisible} toggleFilter={toggleFilter} allList={allList} setList={setList}></Filter>
			<GroupSelect visible={watchlistVisible} watchlists={watchlists} setWatchlistVisible={setWatchlistVisible}></GroupSelect>
		</>
	);
}

export default Quote;
