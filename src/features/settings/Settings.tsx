import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSettings } from './components/ThemeSettings';
import { ViewPreferences } from './components/ViewPreferences';
import { CustomCategories } from './components/CustomCategories';

export default function Settings() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList>
          <TabsTrigger value="theme">Tema</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        <TabsContent value="theme" className="space-y-4">
          <ThemeSettings />
        </TabsContent>
        <TabsContent value="preferences" className="space-y-4">
          <ViewPreferences />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <CustomCategories />
        </TabsContent>
      </Tabs>
    </div>
  );
}

