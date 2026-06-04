import { useState, useEffect, useRef } from 'react';
import { trace } from '@ninebone/util';

const Example1Detail = ({ data }) => {

	useEffect(() => {
		trace.log("[detail] 수신된 데이터:", data?.userId);
		//data?.userId = 'aaa'
	}, [data]);

	const handleSave = (e) => {

        nine.alert("성공적으로 저장되었습니다.");

        const $detailPage = e.target.closest('nine-deck-page');
        if ($detailPage) {
            // 메인 화면에서 이 객체를 받아 리로드를 분기 처리하게 됩니다.
            $detailPage.pageData = { refresh: true };
            trace.log("[detail] 목록 복귀용 새로고침 예약:", $detailPage.pageData);
        }
	};

	return (
		<>
			<nine-panel className="form1 theme-1" max-column="4">
				<label><span className="label">사용자 ID:</span><input type="text" value={data?.userId || ''} readOnly /></label>
                <label><span className="label">사용자명:</span><input type="text" value={data?.userName || ''} readOnly /></label>
                <label><span className="label">역할:</span><input type="text" value={data?.role || ''} readOnly /></label>
                <label><span className="label">이메일:</span><input type="text" value={data?.email || ''} readOnly /></label>
                <label><span className="label">연락처:</span><input type="text" value={data?.tel || ''} readOnly /></label>
                <label><span className="label">성별:</span><input type="text" value={data?.gender || ''} readOnly /></label>
                <label><span className="label">상태:</span><input type="text" value={data?.status || ''} readOnly /></label>
			</nine-panel>

			<div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button onClick={handleSave}>저장</button>
            </div>
		</>
	);
};

export default Example1Detail;