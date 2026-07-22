import { useState, useEffect, useRef } from 'react';
import { api, trace } from "@ninebone/util";
import ninegrid from "@ninebone/grid";
import { useScreen } from '@ninebone/mu';
import { Chart } from 'chart.js/auto';

const NineStat = () => {
    const { goto, selectedData } = useScreen();
    const tabRef = useRef(null);
    const gridRef = useRef(null);
    const chartRef = useRef(null); // Canvas DOM 참조용
    const chartInstance = useRef(null); // Chart.js 인스턴스 관리용

  const updateChart = (historyData) => {
         if (chartInstance.current) {
             chartInstance.current.destroy();
         }

         const reversedData = [...historyData].reverse();
         const ctx = chartRef.current.getContext('2d');

         chartInstance.current = new Chart(ctx, {
             type: 'line',
             data: {
                 labels: reversedData.map(d => d.date),
                 datasets: [
                     {
                         label: '최대 (max)',
                         data: reversedData.map(d => d.max),
                         borderColor: '#FF6384',
                         backgroundColor: 'rgba(255, 99, 132, 0.05)',
                         borderDash: [5, 5],
                         tension: 0.4,
                         fill: false
                     },
                     {
                         label: '평균 (avg)',
                         data: reversedData.map(d => d.avg),
                         borderColor: '#42A5F5',
                         backgroundColor: 'rgba(66, 165, 245, 0.2)',
                         tension: 0.4,
                         fill: true,
                         pointRadius: 4
                     },
                     {
                         label: '최소 (min)',
                         data: reversedData.map(d => d.min),
                         borderColor: '#66BB6A',
                         backgroundColor: 'rgba(102, 187, 106, 0.05)',
                         borderDash: [5, 5],
                         tension: 0.4,
                         fill: false
                     }
                 ]
             },
             options: {
                 responsive: true,
                 maintainAspectRatio: false,
                 interaction: { mode: 'index', intersect: false },
                 scales: {
                     y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
                     x: { grid: { display: false } }
                 },
                 plugins: {
                     tooltip: {
                         callbacks: {
                             // 툴팁의 가장 윗부분(타이틀)에 수행횟수를 표시
                             title: function(context) {
                                 const dataIndex = context[0].dataIndex;
                                 const item = reversedData[dataIndex];
                                 return `${item.date} (수행횟수: ${item.count}회)`;
                             },
                             // 각 라인값은 수치만 표시
                             label: function(context) {
                                 return `${context.dataset.label}: ${context.parsed.y}ms`;
                             }
                         }
                     }
                 }
             }
         });
     };

    const selectList = async (params) => {
        if (!gridRef.current) return;
        const res = await api.post('/nine-mu/stat/query', params);
        console.log(res)
        gridRef.current.data.source = res.list;
    };

    const selectDetail = async (params) => {
        const res = await api.post('/nine-mu/stat/query/detail', params);
        console.log(res)

        if (res.list && res.list.length > 0) {
            updateChart(res.list);
        }
    };

    const handleMainActive = (deliveryData) => {
        if (deliveryData?.refresh === true) {
            //selectList({}); // Refresh data when returning from detail
        }
    };

    useEffect(() => {


        // Initial data load
        selectList({});

        const $currentTab = tabRef.current ?? undefined;
        const $currentGrid = gridRef.current ?? undefined;

        const handleGridLinkClick = (e) => {
            if (e.detail?.target?.dataset?.bind === 'queryId') {
                trace.log("사용자명 링크 클릭. 단건 데이터 셔틀:", e.detail.data);
                selectDetail(e.detail.data);
            }
        };
        $currentGrid?.addEventListener(ninegrid.EVENT.LINK_CLICK, handleGridLinkClick);

        // Natural language search
        const $searchText = ninegrid.querySelector("#searchText", $currentTab);
        const handleSearchTextKeydown = (e) => {
            if (e.key === 'Enter' && !e.isComposing) {
                selectList({ nineSearchText: e.target.value });
            }
        };
        if ($searchText) {
            $searchText.addEventListener('keydown', handleSearchTextKeydown);
        }

        // Classic search
        const $searchBtn = ninegrid.querySelector(".search", $currentTab);
        const handleSearchButtonClick = () => {
            const params = ninegrid.querySelector(".form2", $currentTab).getData();
            selectList(params);
        };
        if ($searchBtn) {
            $searchBtn.addEventListener('click', handleSearchButtonClick);
        }

        // Grid row click for detail
        const handleGridRowClick = (e) => {
            if (e.detail.data && e.detail.data.id) {
                goto('/local/nationalrestaurant/detail1', { id: e.detail.data.id });
            }
        };
        if ($currentGrid) {
            $currentGrid.addEventListener(ninegrid.EVENT.ROW_CLICK, handleGridRowClick);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            $currentGrid?.removeEventListener(ninegrid.EVENT.LINK_CLICK, handleGridLinkClick);

            if ($searchText) {
                $searchText.removeEventListener('keydown', handleSearchTextKeydown);
            }
            if ($searchBtn) {
                $searchBtn.removeEventListener('click', handleSearchButtonClick);
            }
            if ($currentGrid) {
                $currentGrid.removeEventListener(ninegrid.EVENT.ROW_CLICK, handleGridRowClick);
            }
        };
    }, []);

    return (
        <nine-deck router={goto}>
            <nine-deck-page id="main" activeCallback={handleMainActive}>
                <nine-collapse target="nine-deck-page nine-tab"></nine-collapse>
                <nine-tab theme="theme-3" ref={tabRef}>
                    <nine-tab-page caption="자연어 검색">
                        <nine-panel className="form1 theme-1" max-column="1">
                            <input type="text" id="searchText" name="searchText" placeholder="자연어 검색어를 입력하세요"/>
                        </nine-panel>
                    </nine-tab-page>
                    <nine-tab-page caption="클래식 검색">
                        <nine-panel className="form2 theme-1" max-column="4">
                            <label><span className="label">맛집명:</span><input type="text" name="tratnm"/></label>
                            <label><span className="label">도로명주소:</span><input type="text" name="roadnmaddr"/></label>
                            <label><span className="label">시도명:</span><input type="text" name="chrgctpvnm"/></label>
                            <label><span className="label">시군구명:</span><input type="text" name="chrgstatnm"/></label>
                            <label><span className="label">ID:</span><input type="text" name="id"/></label>
                        </nine-panel>
                        <button className="search">검색</button>
                    </nine-tab-page>
                </nine-tab>
                <div className="grid-wrapper">
                    <nine-grid ref={gridRef} caption="쿼리 통계" select-type="row" show-title-bar="true" show-menu-icon="true" show-status-bar="true" enable-fixed-col="true" row-resizable="false" col-movable="true">
                        <table>
                            <colgroup>
                                <col width="40" fixed="left" background-color="gray"/>
                                <col width="100"/>
                                <col width="0"/>
                                <col width="200"/>
                                <col width="60"/>
                                <col width="60"/>
                                <col width="60"/>
                                <col width="60"/>
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Query ID</th>
                                    <th>SQL Hash</th>
                                    <th>SQL</th>
                                    <th>min</th>
                                    <th>max</th>
                                    <th>count</th>
                                    <th>avg</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th><ng-row-indicator/></th>
                                    <td data-bind="queryId"><ng-renderer link="true"/></td>
                                    <td data-bind="sqlHash"></td>
                                    <td data-bind="sql"></td>
                                    <td data-bind="min" text-align="center"></td>
                                    <td data-bind="max" text-align="center"></td>
                                    <td data-bind="count" text-align="center"></td>
                                    <td data-bind="avg" text-align="center"></td>
                                </tr>
                            </tbody>
                        </table>
                    </nine-grid>

                    <nine-splitter/>

                    <div style={{ padding: '31px 0 20px 0', boxSizing: 'border-box', position: 'relative', height: '100%', width: '100%' }}>
                        <div className="chart-container" style={{ padding: '32px 32px', borderBottom: '1px solid #eee', borderTop: '2px solid #666', boxSizing: 'border-box', position: 'relative', height: '100%', width: '100%' }}>
                            <canvas ref={chartRef} style={{ boxSizing: 'border-box' }}></canvas>
                        </div>
                    </div>
                </div>
            </nine-deck-page>
            <nine-deck-page id="detail1" back-target="#main"></nine-deck-page>
        </nine-deck>
    );
};

export default NineStat;