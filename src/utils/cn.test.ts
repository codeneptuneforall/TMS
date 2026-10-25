import assert from 'node:assert/strict';
import { cn, uid } from './cn';

assert.equal(cn('a', false, 'b'), 'a b');
assert.match(uid('x'), /^x-/);
console.log('cn tests passed');