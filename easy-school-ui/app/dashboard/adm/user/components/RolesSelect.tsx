'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { RoleModel } from '@/app/lib/definitions/role_definitions';

type Props = {
  roles: RoleModel[];
  name?: string;
  required?: boolean;
  error?: string | null;
  defaultSelectedIds?: (string | number)[];
  /** Conflict rules BY ID: { "<roleId>": ["<conflictRoleId>", ...] } */
  conflictsById?: Record<string, string[]>;
  placeholder?: string;
  label?: string;
};

export default function RolesMultiSelect({
  roles,
  name = 'roleIds',
  required,
  error,
  defaultSelectedIds = [],
  conflictsById = {},
  placeholder = 'Select one or more roles',
  label = 'Roles',
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(defaultSelectedIds.map(String))
  );
  const [clientError, setClientError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // ---------- Close on click outside or ESC
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // ---------- Normalized role items
  const items = useMemo(
    () =>
      roles.map((r) => ({
        id: String(r.id),
        label: r.role ? String(r.role) : '(UNNAMED ROLE)',
        code: r.code != null ? String(r.code) : undefined,
      })),
    [roles]
  );

  const conflictSetById = useMemo(() => {
    const m = new Map<string, Set<string>>();
    Object.entries(conflictsById).forEach(([id, arr]) => {
      m.set(String(id), new Set(arr.map(String)));
    });
    return m;
  }, [conflictsById]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        (it.code ?? '').toLowerCase().includes(q)
    );
  }, [items, q]);

  // ---------- Disabled (conflicting) IDs
  const disabledIdSet = useMemo(() => {
    const disabled = new Set<string>();
    selected.forEach((id) => {
      const conflicts = conflictSetById.get(id);
      if (!conflicts) return;
      conflicts.forEach((confId) => {
        if (!selected.has(confId)) disabled.add(confId);
      });
    });
    return disabled;
  }, [selected, conflictSetById]);

  // ---------- Toggle with hard conflict blocking
  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);

      // Unselect
      if (next.has(id)) {
        next.delete(id);
        setClientError(null);
        return next;
      }

      // Check conflicts before selecting
      const conflicts = conflictSetById.get(id);
      if (conflicts && Array.from(conflicts).some((c) => next.has(c))) {
        setClientError('Invalid combination of roles.');
        return prev;
      }

      // Reciprocal conflicts
      let reciprocalConflict = false;
      next.forEach((selId) => {
        const cset = conflictSetById.get(selId);
        if (cset && cset.has(id)) reciprocalConflict = true;
      });
      if (reciprocalConflict) {
        setClientError('Invalid combination of roles.');
        return prev;
      }

      next.add(id);
      setClientError(null);
      return next;
    });
  };

  const removeChip = (id: string) => toggle(id);
  const errorMsg = clientError ?? error ?? undefined;

  return (
    <div ref={rootRef} className="mt-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* ---- TRIGGER ---- */}
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-left
          ${errorMsg ? 'border-red-500' : 'border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-purple-600`}
      >
        {selected.size === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {Array.from(selected).map((id) => {
              const it = items.find((x) => x.id === id);
              const label = it?.label ?? id;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs"
                >
                  {label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChip(id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        removeChip(id);
                      }
                    }}
                    className="rounded hover:bg-gray-100 px-1 cursor-pointer select-none"
                    aria-label={`Remove ${label}`}
                    aria-pressed="false"
                  >
                    ×
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {errorMsg && <p className="mt-1 text-sm text-red-600">{errorMsg}</p>}

      {/* ---- MOBILE SHEET ---- */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed inset-x-0 bottom-0 z-50 bg-white p-4 sm:hidden rounded-t-2xl shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">Select roles</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded px-3 py-1 text-sm border"
              >
                Done
              </button>
            </div>
            <input
              className="w-full rounded-md border px-3 py-2 mb-3"
              placeholder="Search roles…"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
            <div
              role="listbox"
              aria-multiselectable="true"
              className="max-h-[60vh] overflow-auto rounded-md border"
            >
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">No roles</div>
              ) : (
                filtered.map((it) => {
                  const checked = selected.has(it.id);
                  const disabled = disabledIdSet.has(it.id) && !checked;
                  return (
                    <label
                      key={it.id}
                      className={`flex items-center gap-3 px-3 py-2 text-base ${
                        disabled
                          ? 'text-gray-400'
                          : 'cursor-pointer hover:bg-purple-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggle(it.id)}
                      />
                      <span className="flex-1">{it.label}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* ---- DESKTOP POPOVER ---- */}
          <div
            className="absolute z-50 mt-1 hidden w-full sm:block"
            role="dialog"
            aria-modal="false"
          >
            <div className="rounded-lg border bg-white p-2 shadow-lg">
              <input
                className="w-full rounded-md border px-3 py-2 mb-2 text-sm"
                placeholder="Search roles…"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
              <div
                role="listbox"
                aria-multiselectable="true"
                className="max-h-64 overflow-auto rounded-md border"
              >
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">No roles</div>
                ) : (
                  filtered.map((it) => {
                    const checked = selected.has(it.id);
                    const disabled = disabledIdSet.has(it.id) && !checked;
                    return (
                      <label
                        key={it.id}
                        className={`flex items-center gap-3 px-3 py-2 text-sm ${
                          disabled
                            ? 'text-gray-400'
                            : 'cursor-pointer hover:bg-purple-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggle(it.id)}
                        />
                        <span className="flex-1">{it.label}</span>
                      </label>
                    );
                  })
                )}
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border px-3 py-1.5 text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hidden inputs for server FormData */}
      {Array.from(selected).map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}
    </div>
  );
}
