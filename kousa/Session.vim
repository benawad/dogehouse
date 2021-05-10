let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Code/dogehouse/dogehouse/kousa
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +34 lib/broth.ex
badd +1 lib/kousa/utils/hash.ex
badd +56 lib/kousa/auth.ex
badd +1 ~/Code/dogehouse/dogehouse/kousa
badd +1 term://~/Code/dogehouse/dogehouse/kousa//67990:/bin/zsh
badd +55 lib/beef/mutations/rooms.ex
badd +69 lib/kousa.ex
badd +249 lib/broth/socket_handler.ex
argglobal
%argdel
$argadd ~/Code/dogehouse/dogehouse/kousa
edit lib/kousa/utils/hash.ex
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
wincmd =
argglobal
balt term://~/Code/dogehouse/dogehouse/kousa//67990:/bin/zsh
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 19 - ((0 * winheight(0) + 13) / 26)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 19
normal! 031|
wincmd w
argglobal
if bufexists("term://~/Code/dogehouse/dogehouse/kousa//67990:/bin/zsh") | buffer term://~/Code/dogehouse/dogehouse/kousa//67990:/bin/zsh | else | edit term://~/Code/dogehouse/dogehouse/kousa//67990:/bin/zsh | endif
if &buftype ==# 'terminal'
  silent file term://~/Code/dogehouse/dogehouse/kousa//67990:/bin/zsh
endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 6991 - ((3 * winheight(0) + 6) / 13)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 6991
normal! 032|
wincmd w
argglobal
if bufexists("lib/kousa/auth.ex") | buffer lib/kousa/auth.ex | else | edit lib/kousa/auth.ex | endif
if &buftype ==# 'terminal'
  silent file lib/kousa/auth.ex
endif
balt lib/broth/socket_handler.ex
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 38 - ((19 * winheight(0) + 20) / 40)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 38
normal! 0
wincmd w
wincmd =
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0&& getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOFAI
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
