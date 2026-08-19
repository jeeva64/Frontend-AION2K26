'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getColleges, addColleges, updateCollege } from '@/services/college';
import { getAdminToken, isSuperAdmin } from '@/lib/auth';
import { aionAlert } from '@/lib/alerts';
import { TN_DISTRICTS } from '@/lib/constants/admin';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import type { College } from '@/lib/types';

const btnPrimary =
  'px-4 py-2 bg-aion-primary text-white text-sm rounded-lg font-medium hover:bg-aion-primary-hover transition disabled:opacity-50 disabled:pointer-events-none';
const btnOutline =
  'px-4 py-2 bg-aion-card border border-aion text-aion-text text-sm rounded-lg font-medium hover:bg-gray-50 transition';
const btnDanger =
  'px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium hover:bg-red-100 transition';
const btnSm =
  'px-3 py-1.5 bg-aion-card border border-aion text-aion-text text-sm rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:pointer-events-none';
const btnSmSuccess =
  'px-3 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-lg border border-green-200 hover:bg-green-100 transition';
const btnSmDanger =
  'px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-200 hover:bg-red-100 transition';
const btnSmPrimary =
  'px-3 py-1.5 bg-aion-primary text-white text-xs font-medium rounded-lg hover:bg-aion-primary-hover transition disabled:opacity-50 disabled:pointer-events-none';

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

function generateAutoCollegeId(district: string, existingIds: string[]): string {
  if (!district) return '';
  const prefix = district.slice(0, 3).toUpperCase();
  const nums = existingIds
    .map((id) => id.toUpperCase().replace(prefix, ''))
    .filter((n) => /^\d{3}$/.test(n))
    .map((n) => parseInt(n, 10));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

export function ManageCollegesPanel() {
  const queryClient = useQueryClient();

  const existingQuery = useQuery<College[], Error>({
    queryKey: ['admin', 'colleges'],
    queryFn: getColleges,
    staleTime: 60000,
  });

  const existingIds = useMemo(
    () => (existingQuery.data ?? []).map((c) => c.collegeId),
    [existingQuery.data],
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-orbitron text-2xl font-bold text-aion-primary">Manage Colleges</h2>
        <p className="text-aion-muted text-sm mt-1">Add new colleges and view existing ones</p>
      </div>

      <AddCollegeSection
        existingIds={existingIds}
        onSubmitted={() => queryClient.invalidateQueries({ queryKey: ['admin', 'colleges'] })}
      />

      <ExistingCollegesSection
        data={existingQuery.data}
        isLoading={existingQuery.isLoading}
        isRefetching={existingQuery.isFetching}
        onRefresh={() => existingQuery.refetch()}
      />
    </div>
  );
}

function AddCollegeSection({
  existingIds,
  onSubmitted,
}: {
  existingIds: string[];
  onSubmitted: () => void;
}) {
  const queryClient = useQueryClient();
  const [list, setList] = useState<College[]>([]);
  const [form, setForm] = useState({ name: '', district: '', state: 'Tamil Nadu' });

  const autoCollegeId = useMemo(
    () => (form.district ? generateAutoCollegeId(form.district, [...existingIds, ...list.map((c) => c.collegeId)]) : ''),
    [form.district, existingIds, list],
  );

  const addMutation = useMutation({
    mutationFn: (colleges: College[]) => {
      const token = getAdminToken();
      if (!token) throw new Error('No admin token');
      return addColleges(colleges, token);
    },
    onSuccess: (result) => {
      setList([]);
      onSubmitted();
      queryClient.invalidateQueries({ queryKey: ['admin', 'colleges'] });
      toast.success(`${result.count || 0} colleges added successfully`);
    },
    onError: (err: Error) => {
      aionAlert.error('Error', err.message || 'Failed to add colleges');
    },
  });

  const handleAddToList = () => {
    const { name, state, district } = form;
    if (!name.trim() || !district || !state.trim()) {
      aionAlert.warning('Required', 'College Name, District and State are required');
      return;
    }
    const cid = autoCollegeId;
    if (!cid) return;
    if (list.some((c) => c.collegeId === cid) || existingIds.includes(cid)) {
      aionAlert.error('Duplicate', 'Generated College ID already exists');
      return;
    }
    setList((prev) => [...prev, { collegeId: cid, name: name.trim(), state: state.trim(), district }]);
    setForm({ name: '', district: '', state: 'Tamil Nadu' });
    toast.success(`${name.trim()} added to list`);
  };

  const handleRemove = (index: number) => {
    const college = list[index];
    aionAlert.confirm({
      title: 'Remove College?',
      html: `<p>Remove ${college.name}?`,
      confirmText: 'Yes, remove',
    }).then((result) => {
      if (result.isConfirmed) {
        setList((prev) => prev.filter((_, i) => i !== index));
        toast.success('College removed from list');
      }
    });
  };

  const handleClearAll = () => {
    if (list.length === 0) {
      aionAlert.info('Empty', 'No colleges to clear');
      return;
    }
    aionAlert.confirm({
      title: 'Clear All?',
      html: `<p>Remove all ${list.length} colleges from the list?`,
      confirmText: 'Yes, clear all',
    }).then((result) => {
      if (result.isConfirmed) {
        setList([]);
        toast.success('All colleges removed from list');
      }
    });
  };

  const handleSubmit = async () => {
    if (list.length === 0) {
      aionAlert.warning('Empty', 'No colleges to submit');
      return;
    }
    const result = await aionAlert.confirm({
      title: 'Submit Colleges?',
      html: `<p>Add ${list.length} colleges to the database?`,
      icon: 'question',
      confirmText: 'Yes, submit',
    });
    if (!result.isConfirmed) return;

    aionAlert.loading('Submitting...', 'Adding colleges to database');
    try {
      await addMutation.mutateAsync(list);
      aionAlert.close();
    } catch {
      aionAlert.close();
    }
  };

  return (
    <div className="bg-aion-card rounded-xl border border-aion p-6">
      <h3 className="font-orbitron text-lg font-semibold text-aion-primary mb-4">Add New Colleges</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field>
          <FieldLabel>College Name</FieldLabel>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Enter college name"
          />
        </Field>
        <Field>
          <FieldLabel>District</FieldLabel>
          <select
            value={form.district}
            onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
            className={selectClass}
          >
            <option value="">Select District</option>
            {TN_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel>College ID (auto-generated)</FieldLabel>
          <Input
            value={autoCollegeId}
            readOnly
            placeholder="Select district first"
            className="bg-gray-50 font-semibold text-blue-600 cursor-not-allowed"
          />
        </Field>
        <Field>
          <FieldLabel>State</FieldLabel>
          <Input
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
          />
        </Field>
      </div>

      <div className="flex gap-3 mb-4">
        <button onClick={handleAddToList} className={btnOutline} disabled={!form.district || !form.name.trim()}>
          Add to List
        </button>
        <button onClick={handleClearAll} className={btnDanger}>
          Clear All
        </button>
      </div>

      {list.length > 0 && (
        <>
          <p className="text-sm text-aion-muted mb-3">{list.length} college(s) in list</p>
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {list.map((college, index) => (
              <div key={college.collegeId} className="flex justify-between items-start bg-white p-3 rounded-lg border border-aion">
                <div className="flex-1">
                  <div className="text-sm text-gray-900 font-medium">{college.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {college.district} &middot; {college.state}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className="font-semibold text-blue-600 text-sm">{college.collegeId}</span>
                  <button onClick={() => handleRemove(index)} className={btnSmDanger}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={addMutation.isPending} className={btnPrimary}>
            {addMutation.isPending ? 'Submitting...' : `Submit ${list.length} Colleges`}
          </button>
        </>
      )}
    </div>
  );
}

function ExistingCollegesSection({
  data,
  isLoading,
  isRefetching,
  onRefresh,
}: {
  data: College[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => void;
}) {
  const canEdit = isSuperAdmin();

  return (
    <div className="bg-aion-card rounded-xl border border-aion p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-orbitron text-lg font-semibold text-aion-primary">Existing Colleges</h3>
        <button onClick={onRefresh} disabled={isRefetching} className={btnSm}>
          {isRefetching ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-aion-primary border-t-transparent" />
        </div>
      ) : !data || data.length === 0 ? (
        <p className="text-aion-muted text-center py-4">No colleges found</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-aion">
                  <TableHead>S.No</TableHead>
                  <TableHead>College Name</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>College ID</TableHead>
                  <TableHead>State</TableHead>
                  {canEdit && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((college, index) => (
                  <CollegeRow key={college.collegeId} college={college} index={index} canEdit={canEdit} data={data} />
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-aion-muted text-center mt-4">Total: {data.length} colleges</p>
        </>
      )}
    </div>
  );
}

function CollegeRow({
  college,
  index,
  canEdit,
  data,
}: {
  college: College;
  index: number;
  canEdit: boolean;
  data: College[];
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: '', state: '', district: '' });

  const allOtherIds = useMemo(
    () => data.filter((c) => c.collegeId !== college.collegeId).map((c) => c.collegeId),
    [data, college.collegeId],
  );

  const autoNewId = useMemo(
    () => (draft.district ? generateAutoCollegeId(draft.district, allOtherIds) : ''),
    [draft.district, allOtherIds],
  );

  const districtChanged = editing && draft.district !== college.district;
  const effectiveCollegeId = districtChanged && autoNewId ? autoNewId : college.collegeId;

  const updateMutation = useMutation({
    mutationFn: (payload: { collegeId?: string; name?: string; state?: string; district?: string }) => {
      const token = getAdminToken();
      if (!token) throw new Error('No admin token');
      return updateCollege(college.collegeId, payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'colleges'] });
      setEditing(false);
      toast.success(`${college.collegeId} updated`);
    },
    onError: (err: Error) => {
      aionAlert.error('Error', err.message || 'Failed to update college');
    },
  });

  const startEdit = useCallback(() => {
    setDraft({ name: college.name || '', state: college.state || '', district: college.district || '' });
    setEditing(true);
  }, [college]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    updateMutation.reset();
  }, [updateMutation]);

  const saveEdit = useCallback(() => {
    if (!draft.name.trim()) {
      aionAlert.warning('Required', 'College name cannot be empty');
      return;
    }
    const idChanged = districtChanged && autoNewId;
    if (idChanged && allOtherIds.includes(autoNewId)) {
      aionAlert.error('Duplicate', `College ID ${autoNewId} already exists`);
      return;
    }
    aionAlert.confirm({
      title: 'Save Changes?',
      html: idChanged
        ? `<p>Update ${college.collegeId} to <strong>${autoNewId}</strong>?`
        : `<p>Update ${college.collegeId}?`,
      icon: 'question',
      confirmText: 'Yes, save',
    }).then((result) => {
      if (result.isConfirmed) {
        updateMutation.mutate({
          ...(idChanged ? { collegeId: autoNewId } : {}),
          name: draft.name.trim(),
          state: draft.state.trim(),
          district: draft.district,
        });
      }
    });
  }, [draft, college.collegeId, districtChanged, autoNewId, allOtherIds, updateMutation]);

  if (editing) {
    return (
      <TableRow className="border-aion bg-blue-50/50">
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          <Input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="h-7 text-sm"
          />
        </TableCell>
        <TableCell>
          <select
            value={draft.district}
            onChange={(e) => setDraft((d) => ({ ...d, district: e.target.value }))}
            className="h-7 w-full rounded-lg border border-input bg-white px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select District</option>
            {TN_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </TableCell>
        <TableCell className="font-semibold text-blue-600">
          {districtChanged && autoNewId ? (
            <span className="text-orange-600">{autoNewId}</span>
          ) : (
            college.collegeId
          )}
        </TableCell>
        <TableCell>
          <Input
            value={draft.state}
            onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value }))}
            className="h-7 text-sm"
          />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1.5">
            <button onClick={saveEdit} disabled={updateMutation.isPending} className={btnSmPrimary}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancelEdit} disabled={updateMutation.isPending} className={btnSm}>
              Cancel
            </button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="border-aion">
      <TableCell>{index + 1}</TableCell>
      <TableCell className="font-medium">{college.name}</TableCell>
      <TableCell>{college.district}</TableCell>
      <TableCell className="font-semibold text-blue-600">{college.collegeId}</TableCell>
      <TableCell>{college.state}</TableCell>
      {canEdit && (
        <TableCell className="text-right">
          <button onClick={startEdit} className={btnSmSuccess}>
            Edit
          </button>
        </TableCell>
      )}
    </TableRow>
  );
}
