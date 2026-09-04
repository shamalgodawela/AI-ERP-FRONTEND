import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiCalendar, FiDatabase, FiTrendingUp } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';

const Collectionopdash = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!startDate || !endDate) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true); 
                const queryParams = `?startDate=${startDate}&endDate=${endDate}`;
                const response = await axios.get(`https://nihon-inventory.onrender.com/api/collection-exe${queryParams}`);
                setData(response.data);
                setLoading(false); 
            } catch (error) {
                console.error('Failed to fetch executive collections', error.message);
                setError('Failed to fetch executive collections');
                setLoading(false); 
            }
        };
        fetchData();
    }, [startDate, endDate]); 

    const chartData = {
        labels: data.map(item => item.exe),
        datasets: [
            {
                data: data.map(item => item.totalCollection),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384',
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 18,
                    font: { family: 'DM Sans', size: 12 },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => ` ${context.label}: ${Number(context.raw).toLocaleString()} LKR`,
                },
            },
        },
    };

    const goBack = () => {
        navigate(-1);
    };

    const grandTotal = data.reduce(
        (sum, item) => sum + (Number(item.totalCollection) || 0),
        0
      );

    return (
        <div className="collectionbyexe-bg">
            <div className="collectionbyexe-container">
                <div className="collectionbyexe-shell">
                    <Link to="#" onClick={goBack} className="back-link"><IoMdArrowRoundBack size={20} /> Back to reports</Link>
                    <div className="report-heading">
                        <div>
                            <p className="eyebrow">COLLECTION PERFORMANCE</p>
                            <h1 className='h1-exe-colelction'>Executive collections</h1>
                            <p className="report-subtitle">Track collection contribution by executive across a selected period.</p>
                        </div>
                        <div className="report-badge"><FiTrendingUp /> Live report</div>
                    </div>
                    <div className="filter-panel">
                        <div className="filter-label"><FiCalendar /><span>Report period</span></div>
                        <div className="search-container">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Start Date"
                        />
                        <span className="date-separator">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                        />
                        </div>
                    </div>
                    {(!startDate || !endDate) && (
                        <div className="report-message empty-message">
                            <FiDatabase />
                            <strong>Select a date range to load the report</strong>
                            <span>Please select both a start date and an end date to view collection data.</span>
                        </div>
                    )}
                    {loading && startDate && endDate && <div className="report-message">Loading collection data...</div>}
                    {error && <div className="report-message error-message">{error}</div>}
                    {!loading && !error && startDate && endDate && (
                        <div className="overview-grid">
                            <div className="metric-card">
                                <span className="metric-label">Total collection</span>
                                <strong>{grandTotal.toLocaleString()}</strong>
                                <span className="metric-unit">LKR across all executives</span>
                            </div>
                            <div className="metric-card metric-card-accent">
                                <span className="metric-label">Active executives</span>
                                <strong>{data.length}</strong>
                                <span className="metric-unit">contributors in this period</span>
                            </div>
                        </div>
                    )}
                </div>
                {!loading && !error && startDate && endDate && (
                    <div className="results-grid">
                        <section className="chart-card chart-card-visual">
                            <div className="section-heading">
                                <div><p className="eyebrow">DISTRIBUTION</p><h2>Collection by executive</h2></div>
                                <span className="section-period">{startDate} - {endDate}</span>
                            </div>
                            <div className="chart-container"><Pie data={chartData} options={chartOptions} /></div>
                        </section>
                        <section className="table-card">
                            <div className="section-heading"><div><p className="eyebrow">DETAILS</p><h2>Executive breakdown</h2></div></div>
                            <table className="exe-table">
        <thead>
          <tr>
            <th>Executive</th>
            <th>Total Collection (LKR)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.exe}</td>
              <td>{Number(item.totalCollection).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
                                                        </table>
                                                        <div className="table-total"><span>Total collection</span><strong>{grandTotal.toLocaleString()} <small>LKR</small></strong></div>
                                                </section>
                                        </div>
                                )}
                        </div>
        </div>
    );
};

export default Collectionopdash;
