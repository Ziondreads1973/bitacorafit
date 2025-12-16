import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage';

/**
 * Mock para @ionic/storage-angular basado en un Map en memoria.
 */
class StorageMock {
  private store = new Map<string, any>();

  // Imitamos la API de @ionic/storage-angular
  create = jasmine.createSpy('create').and.callFake(async () => this);

  async get(key: string): Promise<any> {
    return this.store.get(key) ?? null;
  }

  async set(key: string, value: any): Promise<void> {
    this.store.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

describe('StorageService', () => {
  let service: StorageService;
  let ionicStorage: StorageMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService, { provide: Storage, useClass: StorageMock }],
    });

    service = TestBed.inject(StorageService);
    ionicStorage = TestBed.inject(Storage) as unknown as StorageMock;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializar el Storage interno llamando a create()', async () => {
    // Al usar por primera vez el servicio, debería haberse llamado a create()
    await service.get('cualquier-clave');
    expect(ionicStorage.create).toHaveBeenCalled();
  });

  it('debería devolver null cuando la clave no existe', async () => {
    const value = await service.get('no-existe');
    expect(value).toBeNull();
  });

  it('debería guardar y luego recuperar un valor', async () => {
    await service.set('username', 'pablo');
    const value = await service.get<string>('username');
    expect(value).toBe('pablo');
  });

  it('debería eliminar un valor existente con remove()', async () => {
    await service.set('token', '123456');
    await service.remove('token');

    const value = await service.get<string>('token');
    expect(value).toBeNull();
  });

  it('debería limpiar todos los valores con clear()', async () => {
    await service.set('a', 1);
    await service.set('b', 2);

    await service.clear();

    const a = await service.get<number>('a');
    const b = await service.get<number>('b');

    expect(a).toBeNull();
    expect(b).toBeNull();
  });
});
