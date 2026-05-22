import React, { useState, useMemo } from 'react';
import { useAppSelector } from '@/store';
import { useDeviceSimulation } from '@/hooks/useDeviceSimulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const MovementHistoryPage: React.FC = () => {
  useDeviceSimulation();
  const devices = useAppSelector(s => s.devices.devices);
  const movementHistory = useAppSelector(s => s.devices.movementHistory);

  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.id || '');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpTo, setJumpTo] = useState('');

  const history = useMemo(() => {
    const h = movementHistory[selectedDeviceId] || [];
    return [...h].reverse();
  }, [movementHistory, selectedDeviceId]);

  const totalPages = Math.max(1, Math.ceil(history.length / pageSize));
  const paginatedData = history.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const startEntry = history.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, history.length);

  const handleJump = () => {
    const p = parseInt(jumpTo);
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpTo('');
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl font-bold text-primary text-glow-cyan">MOVEMENT HISTORY</h1>
          <p className="text-muted-foreground text-sm font-mono">Device movement logs & path tracking</p>
        </div>
        <Button variant="outline" size="sm" className="font-mono text-xs border-primary/20 text-primary hover:bg-primary/10">
          <Download className="w-3.5 h-3.5 mr-1" /> Export PDF
        </Button>
      </div>

      {/* Device selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-mono">DEVICE:</span>
          <Select value={selectedDeviceId} onValueChange={v => { setSelectedDeviceId(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-56 bg-muted/50 border-primary/20 font-mono text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/20">
              {devices.map(d => (
                <SelectItem key={d.id} value={d.id} className="font-mono text-sm">{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{history.length} records</span>
      </div>

      {/* Data Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs text-primary">TIMESTAMP</TableHead>
                <TableHead className="font-mono text-xs text-primary">X</TableHead>
                <TableHead className="font-mono text-xs text-primary">Y</TableHead>
                <TableHead className="font-mono text-xs text-primary">ZONE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground font-mono py-8">
                    No movement data recorded yet. Data accumulates in real-time.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((pos, i) => (
                  <TableRow key={i} className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{new Date(pos.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs text-primary">{pos.x.toFixed(1)}</TableCell>
                    <TableCell className="font-mono text-xs text-secondary">{pos.y.toFixed(1)}</TableCell>
                    <TableCell className="text-xs">{pos.zone}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Multi-level Pagination */}
      {history.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Entry range & page size */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {startEntry}-{endEntry} of {history.length}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-mono">Per page:</span>
              <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-16 h-7 bg-muted/50 border-primary/20 font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  {[5, 10, 20, 50].map(n => (
                    <SelectItem key={n} value={String(n)} className="font-mono text-xs">{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7 border-primary/20" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7 border-primary/20" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>

            {getPageNumbers().map((page, i) => (
              typeof page === 'string' ? (
                <span key={`e${i}`} className="px-1 text-muted-foreground text-xs">...</span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="icon"
                  className={cn('h-7 w-7 text-xs font-mono border-primary/20', page === currentPage && 'glow-cyan')}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            ))}

            <Button variant="outline" size="icon" className="h-7 w-7 border-primary/20" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7 border-primary/20" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
              <ChevronsRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Jump to page */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-mono">Go to:</span>
            <Input
              value={jumpTo}
              onChange={e => setJumpTo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleJump()}
              className="w-14 h-7 bg-muted/50 border-primary/20 font-mono text-xs text-center"
              placeholder="#"
            />
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs font-mono border-primary/20" onClick={handleJump}>Go</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementHistoryPage;
