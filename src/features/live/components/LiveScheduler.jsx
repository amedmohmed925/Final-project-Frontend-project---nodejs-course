import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoading, setError, setSession
} from '../liveSlice.js';
import { createLiveSession, startLiveSession, getIceForSession } from '../api/liveApi.js';

const LiveScheduler = ({ form, setForm, onStartNow, onCreated }) => {
  const dispatch = useDispatch();
  const { loading, session } = useSelector(s => s.live);

  const schedule = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true)); dispatch(setError(null));
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        courseId: form.courseId,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        durationMinutes: Number(form.durationMinutes) || 60,
      };
      const data = await createLiveSession(payload);
      dispatch(setSession(data));
      onCreated?.(data);
    } catch (err) {
      dispatch(setError(err?.response?.data?.message || 'Failed to schedule'));
    } finally { dispatch(setLoading(false)); }
  };

  const startScheduledNow = async () => {
    if (!session?._id) return;
    dispatch(setLoading(true)); dispatch(setError(null));
    try {
      await startLiveSession(session._id);
      await getIceForSession(session._id); // optional prefetch
      onStartNow?.(session);
    } catch (err) {
      dispatch(setError(err?.response?.data?.message || 'Failed to start session'));
    } finally { dispatch(setLoading(false)); }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-3">Schedule a Live</h5>
        <form onSubmit={schedule} className="row g-3">
          <div className="col-12">
            <label className="form-label">Title</label>
            <input className="form-control" required
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Session title" />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea rows={2} className="form-control"
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional details" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Course ID</label>
            <input className="form-control" required
              value={form.courseId}
              onChange={(e) => setForm(f => ({ ...f, courseId: e.target.value }))}
              placeholder="COURSE_ID" />
          </div>
            <div className="col-12 col-md-6">
            <label className="form-label">Duration (minutes)</label>
            <input type="number" min="15" className="form-control"
              value={form.durationMinutes}
              onChange={(e) => setForm(f => ({ ...f, durationMinutes: e.target.value }))} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Scheduled At</label>
            <input type="datetime-local" className="form-control" required
              value={form.scheduledAt}
              onChange={(e) => setForm(f => ({ ...f, scheduledAt: e.target.value }))} />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
            <button type="button" className="btn btn-outline-secondary"
              onClick={() => onStartNow?.('instant')}
              disabled={loading}>
              {loading ? 'Starting...' : 'Go Live Now'}
            </button>
            {session?._id && (
              <button type="button" className="btn btn-success" onClick={startScheduledNow}>
                Start Scheduled Now
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiveScheduler;
