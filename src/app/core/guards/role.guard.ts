import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export function roleGuard(role: 'teacher' | 'student'): CanMatchFn {
  return () => {
    const router = inject(Router);
    const user = localStorage.getItem('user');
    if (!user) {
      router.navigate(['/login']);
      return false;
    }
    try {
      const parsed = JSON.parse(user);
      if (parsed?.role === role) return true;
    } catch {}
    router.navigate(['/login']);
    return false;
  };
}

