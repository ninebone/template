import { useState, useEffect, useRef } from 'react';
import { trace } from '@ninebone/util';

const Example1Popup = ({ data }) => {

	useEffect(() => {
		trace.log("[popup] 수신된 데이터:", data);
	}, [data]);

    const handleSave = (e) => {

        const returnData = {
            refresh: true,
            savedId: data?.userId
        };

        nine.alert("성공적으로 저장되었습니다.").then(res => {
            nine.closest('nine-popup', e.target)?.close(returnData);
        });
    };

	return (
		<>
			<nine-panel className="form1 theme-1" max-column="1">
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

export default Example1Popup;