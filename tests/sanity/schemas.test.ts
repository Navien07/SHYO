import { describe, it, expect } from 'vitest';
import { programme } from '../../src/sanity/schemas/programme';
import { teamMember } from '../../src/sanity/schemas/teamMember';
import { document } from '../../src/sanity/schemas/document';
import { siteSettings } from '../../src/sanity/schemas/siteSettings';
import { schemaTypes } from '../../src/sanity/schemas/index';

function getFieldNames(schema: { fields?: Array<{ name: string }> }): string[] {
  return (schema.fields ?? []).map(f => f.name);
}

function hasLocalizedField(schema: { fields?: Array<{ name: string; fields?: Array<{ name: string }> }> }, fieldName: string): boolean {
  const field = schema.fields?.find(f => f.name === fieldName);
  if (!field || !field.fields) return false;
  const subNames = field.fields.map((f: { name: string }) => f.name);
  return subNames.includes('en') && subNames.includes('ms') && subNames.includes('ta');
}

describe('programme schema', () => {
  it('has name "programme"', () => expect(programme.name).toBe('programme'));
  it('has localized title field', () => expect(hasLocalizedField(programme, 'title')).toBe(true));
  it('has localized description field', () => expect(hasLocalizedField(programme, 'description')).toBe(true));
  it('has image field', () => expect(getFieldNames(programme)).toContain('image'));
  it('has category field', () => expect(getFieldNames(programme)).toContain('category'));
  it('has slug field', () => expect(getFieldNames(programme)).toContain('slug'));
});

describe('teamMember schema', () => {
  it('has name "teamMember"', () => expect(teamMember.name).toBe('teamMember'));
  it('has localized name field', () => expect(hasLocalizedField(teamMember, 'name')).toBe(true));
  it('has localized role field', () => expect(hasLocalizedField(teamMember, 'role')).toBe(true));
  it('has photo field', () => expect(getFieldNames(teamMember)).toContain('photo'));
  it('has order field', () => expect(getFieldNames(teamMember)).toContain('order'));
});

describe('document schema', () => {
  it('has name "document"', () => expect(document.name).toBe('document'));
  it('has localized title field', () => expect(hasLocalizedField(document, 'title')).toBe(true));
  it('has category field', () => expect(getFieldNames(document)).toContain('category'));
  it('has year field', () => expect(getFieldNames(document)).toContain('year'));
  it('has file field', () => expect(getFieldNames(document)).toContain('file'));
});

describe('siteSettings schema', () => {
  it('has name "siteSettings"', () => expect(siteSettings.name).toBe('siteSettings'));
  it('has contactEmail field', () => expect(getFieldNames(siteSettings)).toContain('contactEmail'));
  it('has whatsappNumber field', () => expect(getFieldNames(siteSettings)).toContain('whatsappNumber'));
  it('has facebookUrl field', () => expect(getFieldNames(siteSettings)).toContain('facebookUrl'));
  it('has instagramUrl field', () => expect(getFieldNames(siteSettings)).toContain('instagramUrl'));
  it('does not allow create action', () => {
    const actions = (siteSettings as { __experimental_actions?: string[] }).__experimental_actions ?? [];
    expect(actions).not.toContain('create');
    expect(actions).not.toContain('delete');
  });
  it('has heroImage field', () => expect(getFieldNames(siteSettings)).toContain('heroImage'));
  it('has memberCount field', () => expect(getFieldNames(siteSettings)).toContain('memberCount'));
  it('has programmesDelivered field', () => expect(getFieldNames(siteSettings)).toContain('programmesDelivered'));
});

describe('schema registry', () => {
  it('exports an array of 4 schemas', () => expect(schemaTypes).toHaveLength(4));
  it('includes all four schema types', () => {
    const names = schemaTypes.map(s => s.name);
    expect(names).toContain('programme');
    expect(names).toContain('teamMember');
    expect(names).toContain('document');
    expect(names).toContain('siteSettings');
  });
});
